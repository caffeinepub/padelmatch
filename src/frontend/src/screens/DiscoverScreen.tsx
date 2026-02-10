import { useState, useEffect } from 'react';
import { useDiscoverCandidates } from '../hooks/useQueries';
import { Filters, Category } from '../backend';
import DiscoverCard from '../components/DiscoverCard';
import DiscoverFilters from '../components/DiscoverFilters';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ALL_DEPARTMENTS } from '../utils/uruguayDepartments';

export default function DiscoverScreen() {
  const [minCategory, setMinCategory] = useState<Category>(Category.first);
  const [maxCategory, setMaxCategory] = useState<Category>(Category.seventh);
  const [zone, setZone] = useState<string>(ALL_DEPARTMENTS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedUsers, setPassedUsers] = useState<Set<string>>(new Set());

  // For now, we still pass the old Filters enum to the backend (no server-side filtering changes)
  const { data: candidates = [], isLoading } = useDiscoverCandidates(Filters.category);

  // Filter out passed users
  const availableCandidates = candidates.filter(
    (c) => !passedUsers.has(c.id.toString())
  );

  const currentCandidate = availableCandidates[currentIndex];

  const handleLike = () => {
    if (!currentCandidate) return;
    // In Draft 13, there's no backend like functionality, just move to next
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
  }, [minCategory, maxCategory, zone]);

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

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="rounded-full px-6 py-2 h-auto font-semibold text-base border-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:border-emerald-500"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              FILTROS
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <DiscoverFilters
              minCategory={minCategory}
              maxCategory={maxCategory}
              zone={zone}
              onMinCategoryChange={setMinCategory}
              onMaxCategoryChange={setMaxCategory}
              onZoneChange={setZone}
            />
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
              >
                <X className="h-8 w-8 text-red-500" />
              </Button>

              <Button
                onClick={handleLike}
                size="lg"
                className="h-16 w-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
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
