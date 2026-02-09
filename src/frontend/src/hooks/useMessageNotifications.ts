import { useEffect, useRef, useState, useCallback } from 'react';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import type { ChatMessage, Profile } from '../backend';
import { loadUnreadState, saveUnreadState } from '../utils/unreadMessagesStore';

const POLL_INTERVAL = 4000; // 4 seconds

function createMessageKey(msg: ChatMessage): string {
  return `${msg.timestamp.toString()}_${msg.sender.toString()}_${msg.content}`;
}

export function useMessageNotifications(
  currentScreen: string,
  chatRecipient: Principal | null,
  enabled: boolean = true
) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadBySender, setUnreadBySender] = useState<Map<string, number>>(new Map());
  
  const seenMessagesRef = useRef<Set<string>>(new Set());
  const lastPolledRef = useRef<bigint>(BigInt(0));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const profileCacheRef = useRef<Map<string, string>>(new Map());

  // Load unread state from localStorage on mount
  useEffect(() => {
    if (!identity) return;
    
    const principal = identity.getPrincipal();
    const state = loadUnreadState(principal);
    
    seenMessagesRef.current = state.unreadMessageKeys;
    lastPolledRef.current = BigInt(state.lastPolledTimestamp);
    setUnreadBySender(state.unreadBySender);
    
    // Calculate total unread count
    let total = 0;
    state.unreadBySender.forEach(count => total += count);
    setUnreadCount(total);
  }, [identity]);

  // Fetch profile name for a sender
  const fetchSenderName = useCallback(async (sender: Principal): Promise<string> => {
    const senderStr = sender.toString();
    
    // Check cache first
    if (profileCacheRef.current.has(senderStr)) {
      return profileCacheRef.current.get(senderStr)!;
    }

    // Fetch from backend
    try {
      if (!actor) return 'Un match';
      const profile: Profile | null = await actor.getUserProfile(sender);
      const name = profile?.name || 'Un match';
      profileCacheRef.current.set(senderStr, name);
      return name;
    } catch (error) {
      console.error('Error fetching sender profile:', error);
      return 'Un match';
    }
  }, [actor]);

  // Mark a sender's thread as read
  const markAsRead = useCallback((sender: Principal) => {
    if (!identity) return;

    const senderStr = sender.toString();
    const principal = identity.getPrincipal();
    
    // Remove all messages from this sender from seen set
    const newSeenMessages = new Set(seenMessagesRef.current);
    const messagesToRemove: string[] = [];
    
    newSeenMessages.forEach(key => {
      if (key.includes(senderStr)) {
        messagesToRemove.push(key);
      }
    });
    
    messagesToRemove.forEach(key => newSeenMessages.delete(key));
    seenMessagesRef.current = newSeenMessages;
    
    // Update unread count for this sender
    const newUnreadBySender = new Map(unreadBySender);
    newUnreadBySender.delete(senderStr);
    setUnreadBySender(newUnreadBySender);
    
    // Recalculate total
    let total = 0;
    newUnreadBySender.forEach(count => total += count);
    setUnreadCount(total);
    
    // Persist to localStorage
    saveUnreadState(principal, {
      lastPolledTimestamp: lastPolledRef.current.toString(),
      unreadMessageKeys: seenMessagesRef.current,
      unreadBySender: newUnreadBySender,
    });
  }, [identity, unreadBySender]);

  // Poll for new messages
  const pollMessages = useCallback(async () => {
    if (!actor || !identity || !enabled) return;

    try {
      const newMessages = await actor.fetchNewMessagesSince(lastPolledRef.current);
      
      if (newMessages.length === 0) return;

      const principal = identity.getPrincipal();
      const currentChatRecipientStr = chatRecipient?.toString();
      const newUnreadBySender = new Map(unreadBySender);
      
      for (const msg of newMessages) {
        const msgKey = createMessageKey(msg);
        const senderStr = msg.sender.toString();
        
        // Skip if already seen
        if (seenMessagesRef.current.has(msgKey)) continue;
        
        // Add to seen messages
        seenMessagesRef.current.add(msgKey);
        
        // Skip notification if currently chatting with this sender
        if (currentScreen === 'chat' && currentChatRecipientStr === senderStr) {
          continue;
        }
        
        // Increment unread count for this sender
        const currentCount = newUnreadBySender.get(senderStr) || 0;
        newUnreadBySender.set(senderStr, currentCount + 1);
        
        // Show toast notification
        const senderName = await fetchSenderName(msg.sender);
        toast.info(`Nuevo mensaje de ${senderName}`, {
          description: msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content,
        });
      }
      
      // Update state
      setUnreadBySender(newUnreadBySender);
      
      // Calculate total unread
      let total = 0;
      newUnreadBySender.forEach(count => total += count);
      setUnreadCount(total);
      
      // Update last polled timestamp
      const latestTimestamp = newMessages[newMessages.length - 1].timestamp;
      lastPolledRef.current = latestTimestamp;
      
      // Persist to localStorage
      saveUnreadState(principal, {
        lastPolledTimestamp: latestTimestamp.toString(),
        unreadMessageKeys: seenMessagesRef.current,
        unreadBySender: newUnreadBySender,
      });
      
    } catch (error) {
      console.error('Error polling messages:', error);
    }
  }, [actor, identity, currentScreen, chatRecipient, unreadBySender, fetchSenderName, enabled]);

  // Start/stop polling based on enabled flag
  useEffect(() => {
    if (!enabled || !actor || actorFetching || !identity) {
      // Clear interval if disabled or not ready
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial poll
    pollMessages();
    
    // Set up interval
    intervalRef.current = setInterval(pollMessages, POLL_INTERVAL);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, actor, actorFetching, identity, pollMessages]);

  return {
    unreadCount,
    unreadBySender,
    markAsRead,
  };
}
