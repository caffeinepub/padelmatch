import { Suspense, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LoginScreen from './screens/LoginScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import AppShell from './components/AppShell';
import StartupShell from './components/StartupShell';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { startupPerf } from './utils/startupPerf';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Log first meaningful render timing
  useEffect(() => {
    if (!isInitializing) {
      startupPerf.mark('identity-resolved');
    }
    
    if (isAuthenticated && isFetched) {
      startupPerf.mark('profile-resolved');
    }
    
    if (!isInitializing && (!isAuthenticated || (isAuthenticated && isFetched))) {
      startupPerf.mark('first-meaningful-render');
      startupPerf.measure('time-to-interactive', 'app-bootstrap', 'first-meaningful-render');
      startupPerf.logReport();
    }
  }, [isInitializing, isAuthenticated, isFetched]);

  // Show lightweight startup shell only during critical initialization
  // (identity check or authenticated profile routing decision)
  if (isInitializing || (isAuthenticated && !isFetched)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <StartupShell />
      </ThemeProvider>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LoginScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Authenticated but no profile - show profile setup
  const showProfileSetup = isAuthenticated && isFetched && userProfile === null;
  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ProfileSetupScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Authenticated with profile - show main app
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Suspense fallback={<StartupShell />}>
        <AppShell />
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}
