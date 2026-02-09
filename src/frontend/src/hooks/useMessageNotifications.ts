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
  chatRecipient: Principal | null
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

    // Update unread counts
    const newUnreadBySender = new Map(unreadBySender);
    newUnreadBySender.delete(senderStr);
    setUnreadBySender(newUnreadBySender);

    // Recalculate total
    let total = 0;
    newUnreadBySender.forEach(count => total += count);
    setUnreadCount(total);

    // Save to localStorage
    const state = loadUnreadState(principal);
    state.unreadMessageKeys = newSeenMessages;
    state.unreadBySender = newUnreadBySender;
    saveUnreadState(principal, state);
  }, [identity, unreadBySender]);

  // Polling function
  const pollForNewMessages = useCallback(async () => {
    if (!actor || actorFetching || !identity) return;

    try {
      const since = lastPolledRef.current;
      const newMessages: ChatMessage[] = await actor.fetchNewMessagesSince(since);
      
      if (newMessages.length === 0) return;

      const principal = identity.getPrincipal();
      const currentChatRecipientStr = chatRecipient?.toString();
      const newUnreadBySender = new Map(unreadBySender);
      let hasNewUnread = false;

      for (const msg of newMessages) {
        const messageKey = createMessageKey(msg);
        
        // Skip if already seen
        if (seenMessagesRef.current.has(messageKey)) continue;
        
        // Mark as seen
        seenMessagesRef.current.add(messageKey);
        
        const senderStr = msg.sender.toString();
        
        // Skip if this message is from the currently open chat
        if (currentScreen === 'chat' && currentChatRecipientStr === senderStr) {
          continue;
        }

        // Increment unread count for this sender
        const currentCount = newUnreadBySender.get(senderStr) || 0;
        newUnreadBySender.set(senderStr, currentCount + 1);
        hasNewUnread = true;

        // Show toast notification
        const senderName = await fetchSenderName(msg.sender);
        toast(`New message from ${senderName}`, {
          description: msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content,
        });
      }

      // Update last polled timestamp to the latest message timestamp
      const latestTimestamp = newMessages.reduce(
        (max, msg) => msg.timestamp > max ? msg.timestamp : max,
        lastPolledRef.current
      );
      lastPolledRef.current = latestTimestamp;

      if (hasNewUnread) {
        setUnreadBySender(newUnreadBySender);
        
        // Calculate total unread
        let total = 0;
        newUnreadBySender.forEach(count => total += count);
        setUnreadCount(total);

        // Save to localStorage
        const state = loadUnreadState(principal);
        state.lastPolledTimestamp = latestTimestamp.toString();
        state.unreadMessageKeys = seenMessagesRef.current;
        state.unreadBySender = newUnreadBySender;
        saveUnreadState(principal, state);
      }
    } catch (error) {
      console.error('Error polling for new messages:', error);
    }
  }, [actor, actorFetching, identity, chatRecipient, currentScreen, unreadBySender, fetchSenderName]);

  // Start/stop polling
  useEffect(() => {
    if (!actor || actorFetching || !identity) {
      return;
    }

    // Start polling
    intervalRef.current = setInterval(pollForNewMessages, POLL_INTERVAL);

    // Initial poll
    pollForNewMessages();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [actor, actorFetching, identity, pollForNewMessages]);

  return {
    unreadCount,
    unreadBySender,
    markAsRead,
  };
}
