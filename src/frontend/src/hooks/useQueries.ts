import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Profile, Level, Position, Zone } from '../backend';
import { ExternalBlob, Filters } from '../backend';
import { toast } from 'sonner';

// Profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Profile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor no disponible');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      age: bigint;
      level: Level;
      position: Position;
      zone: Zone;
      availability: string[];
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor no disponible');
      await actor.createProfile(
        data.name,
        data.age,
        data.level,
        data.position,
        data.zone,
        data.availability,
        data.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Perfil creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al crear perfil: ' + error.message);
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      age: bigint;
      level: Level;
      position: Position;
      zone: Zone;
      availability: string[];
      bio: string;
    }) => {
      if (!actor) throw new Error('Actor no disponible');
      await actor.updateProfile(
        data.name,
        data.age,
        data.level,
        data.position,
        data.zone,
        data.availability,
        data.bio
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Perfil actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al actualizar perfil: ' + error.message);
    },
  });
}

export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photo: ExternalBlob) => {
      if (!actor) throw new Error('Actor no disponible');
      await actor.uploadPhoto(photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Foto actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error('Error al subir foto: ' + error.message);
    },
  });
}

// Discover queries
export function useDiscoverCandidates(filters: Filters) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Profile[]>({
    queryKey: ['discoverCandidates', filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.discoverCandidates(filters);
    },
    enabled: !!actor && !actorFetching,
  });
}
