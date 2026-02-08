import { useState, useEffect } from 'react';
import { useDiscoverCandidates, useLikeUser } from '../hooks/useQueries';
import { Level } from '../backend';
import DiscoverCard from '../components/DiscoverCard';
import DiscoverFilters from '../components/DiscoverFilters';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function DiscoverScreen() {
  const [filters, setFilters] = useState({
    levelMin: Level.one,
    levelMax: Level.five,
    zone: '',
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedUsers, setPassedUsers] = useState<Set<string>>(new Set());

  const { data: candidates = [], isLoading } = useDiscoverCandidates(filters);
  const likeUser = useLikeUser();

  // Filter out passed users
  const availableCandidates = candidates.filter(
    (c) => !passedUsers.has(c.id.toString())
  );

  const currentCandidate = availableCandidates[currentIndex];

  const handleLike = () => {
    if (!currentCandidate) return;
    likeUser.mutate(currentCandidate.id);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePass = () => {
    if (!currentCandidate) return;
    setPassedUsers((prev) => new Set(prev).add(currentCandidate.id.toString()));
    setCurrentIndex((prev) => prev + 1);
  };

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setPassedUsers(new Set());
  }, [filters]);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            Descubrir
          </h1>
          <p className="text-sm text-muted-foreground">
            {availableCandidates.length} jugadores disponibles
          </p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <DiscoverFilters filters={filters} onFiltersChange={setFilters} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Card Stack */}
      <div className="relative min-h-[600px] flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Buscando jugadores...</p>
          </div>
        ) : !currentCandidate ? (
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">
              No hay más jugadores disponibles
            </p>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar tus filtros
            </p>
          </div>
        ) : (
          <div className="w-full">
            <DiscoverCard profile={currentCandidate} />

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-8">
              <Button
                onClick={handlePass}
                size="lg"
                variant="outline"
                className="h-16 w-16 rounded-full border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                disabled={likeUser.isPending}
              >
                <X className="h-8 w-8 text-red-500" />
              </Button>

              <Button
                onClick={handleLike}
                size="lg"
                className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                disabled={likeUser.isPending}
              >
                <Heart className="h-8 w-8 text-white" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
