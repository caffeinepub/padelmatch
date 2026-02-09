import { lazy, Suspense, useState, useEffect } from 'react';
import { Home, MessageCircle, User, Settings } from 'lucide-react';
import DiscoverScreen from '../screens/DiscoverScreen';
import InlineScreenFallback from './InlineScreenFallback';
import { Principal } from '@dfinity/principal';
import { useMessageNotifications } from '../hooks/useMessageNotifications';
import { Badge } from '@/components/ui/badge';

// Lazy load non-initial screens for code-splitting
const MatchesScreen = lazy(() => import('../screens/MatchesScreen'));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen'));
const SettingsScreen = lazy(() => import('../screens/SettingsScreen'));
const ChatScreen = lazy(() => import('../screens/ChatScreen'));
const MatchProfileScreen = lazy(() => import('../screens/MatchProfileScreen'));

type Screen = 'discover' | 'matches' | 'profile' | 'settings' | 'chat' | 'matchProfile';

export default function AppShell() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('discover');
  const [chatRecipient, setChatRecipient] = useState<Principal | null>(null);
  const [matchProfileUser, setMatchProfileUser] = useState<Principal | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('matches');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Defer notification polling until after first render
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise setTimeout
    const enableNotifications = () => {
      setNotificationsEnabled(true);
    };

    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(enableNotifications, { timeout: 2000 });
      return () => cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(enableNotifications, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const { unreadCount, markAsRead } = useMessageNotifications(
    currentScreen,
    chatRecipient,
    notificationsEnabled
  );

  const openChat = (recipientId: Principal) => {
    // Mark this thread as read before opening
    markAsRead(recipientId);
    setChatRecipient(recipientId);
    setPreviousScreen(currentScreen);
    setCurrentScreen('chat');
  };

  const closeChat = () => {
    setChatRecipient(null);
    setCurrentScreen('matches');
  };

  const openMatchProfile = (userId: Principal, fromScreen: Screen = 'matches') => {
    setMatchProfileUser(userId);
    setPreviousScreen(fromScreen);
    setCurrentScreen('matchProfile');
  };

  const closeMatchProfile = () => {
    setMatchProfileUser(null);
    setCurrentScreen(previousScreen);
  };

  // Keep marking as read while chat is open
  useEffect(() => {
    if (currentScreen === 'chat' && chatRecipient) {
      markAsRead(chatRecipient);
    }
  }, [currentScreen, chatRecipient, markAsRead]);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Suspense fallback={<InlineScreenFallback />}>
          {currentScreen === 'discover' && <DiscoverScreen />}
          {currentScreen === 'matches' && (
            <MatchesScreen 
              onOpenChat={openChat} 
              onOpenProfile={(userId) => openMatchProfile(userId, 'matches')}
            />
          )}
          {currentScreen === 'profile' && <ProfileScreen />}
          {currentScreen === 'settings' && <SettingsScreen />}
          {currentScreen === 'chat' && chatRecipient && (
            <ChatScreen 
              recipientId={chatRecipient} 
              onBack={closeChat}
              onOpenProfile={(userId) => openMatchProfile(userId, 'chat')}
            />
          )}
          {currentScreen === 'matchProfile' && matchProfileUser && (
            <MatchProfileScreen 
              userId={matchProfileUser} 
              onBack={closeMatchProfile}
            />
          )}
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border shadow-lg">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          <button
            onClick={() => setCurrentScreen('discover')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentScreen === 'discover'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Descubrir</span>
          </button>

          <button
            onClick={() => setCurrentScreen('matches')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
              currentScreen === 'matches' || currentScreen === 'chat' || currentScreen === 'matchProfile'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 px-1 text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1">Matches</span>
          </button>

          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentScreen === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Perfil</span>
          </button>

          <button
            onClick={() => setCurrentScreen('settings')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentScreen === 'settings'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Ajustes</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
