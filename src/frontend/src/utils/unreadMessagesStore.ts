import { Principal } from '@dfinity/principal';

interface UnreadState {
  lastPolledTimestamp: string; // bigint as string
  unreadMessageKeys: Set<string>; // Set of message keys (timestamp+sender+content)
  unreadBySender: Map<string, number>; // sender principal -> count
}

const STORAGE_KEY_PREFIX = 'padelmatch_unread_';

function getStorageKey(principal: Principal): string {
  return `${STORAGE_KEY_PREFIX}${principal.toString()}`;
}

export function loadUnreadState(principal: Principal): UnreadState {
  try {
    const key = getStorageKey(principal);
    const stored = localStorage.getItem(key);
    if (!stored) {
      return {
        lastPolledTimestamp: '0',
        unreadMessageKeys: new Set(),
        unreadBySender: new Map(),
      };
    }
    const parsed = JSON.parse(stored);
    return {
      lastPolledTimestamp: parsed.lastPolledTimestamp || '0',
      unreadMessageKeys: new Set(parsed.unreadMessageKeys || []),
      unreadBySender: new Map(Object.entries(parsed.unreadBySender || {})),
    };
  } catch (error) {
    console.error('Error loading unread state:', error);
    return {
      lastPolledTimestamp: '0',
      unreadMessageKeys: new Set(),
      unreadBySender: new Map(),
    };
  }
}

export function saveUnreadState(principal: Principal, state: UnreadState): void {
  try {
    const key = getStorageKey(principal);
    const toStore = {
      lastPolledTimestamp: state.lastPolledTimestamp,
      unreadMessageKeys: Array.from(state.unreadMessageKeys),
      unreadBySender: Object.fromEntries(state.unreadBySender),
    };
    localStorage.setItem(key, JSON.stringify(toStore));
  } catch (error) {
    console.error('Error saving unread state:', error);
  }
}

export function clearUnreadState(principal: Principal): void {
  try {
    const key = getStorageKey(principal);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing unread state:', error);
  }
}
