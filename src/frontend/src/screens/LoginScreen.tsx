import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 dark:from-emerald-950 dark:via-blue-950 dark:to-teal-950 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/assets/generated/playpal-logo.dim_512x512.png"
            alt="PlayPal"
            className="h-32 w-auto"
          />
        </div>

        {/* Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">
            PlayPal
          </h1>
          <p className="text-lg text-muted-foreground">
            Encuentra tu compañero de pádel perfecto
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 py-8">
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <Heart className="h-5 w-5 text-emerald-500" />
            <span>Desliza, conecta y juega</span>
          </div>
        </div>

        {/* Login Button */}
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold py-6 text-lg rounded-2xl shadow-lg"
        >
          {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Footer */}
        <p className="text-xs text-muted-foreground pt-8">
          © 2026. Built with <Heart className="inline h-3 w-3 text-red-500" /> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline dark:text-emerald-400"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
