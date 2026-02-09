import { useState } from 'react';
import DiscoverScreen from '../screens/DiscoverScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Heart, User, Settings } from 'lucide-react';

type Screen = 'discover' | 'profile' | 'settings';

export default function AppShell() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('discover');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'discover':
        return <DiscoverScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DiscoverScreen />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">{renderScreen()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setCurrentScreen('discover')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentScreen === 'discover'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Descubrir</span>
          </button>

          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentScreen === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400'
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
                : 'text-gray-500 dark:text-gray-400'
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
