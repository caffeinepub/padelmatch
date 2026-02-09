import { Loader2 } from 'lucide-react';

export default function StartupShell() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950">
      {/* Lightweight header skeleton */}
      <header className="border-b border-border/40 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="h-8 w-32 bg-emerald-200/50 dark:bg-emerald-800/50 rounded animate-pulse" />
        </div>
      </header>

      {/* Main content area with centered spinner */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400 mx-auto" />
          <p className="text-sm text-muted-foreground">Iniciando...</p>
        </div>
      </main>

      {/* Bottom nav skeleton */}
      <nav className="border-t border-border/40 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
