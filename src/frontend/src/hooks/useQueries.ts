import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Profile, Match, ChatMessage, Filters, Level, Position, Zone } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';
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

export function useGetUserProfile(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Profile | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
    retry: 1,
    retryDelay: 1000,
  });
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

export function useLikeUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetId: Principal) => {
      if (!actor) throw new Error('Actor no disponible');
      return actor.likeUser(targetId);
    },
    onSuccess: (isMatch: boolean) => {
      if (isMatch) {
        toast.success('¡Es un match! 🎉');
        queryClient.invalidateQueries({ queryKey: ['matches'] });
      }
      queryClient.invalidateQueries({ queryKey: ['discoverCandidates'] });
    },
    onError: (error: Error) => {
      toast.error('Error: ' + error.message);
    },
  });
}

// Matches queries
export function useGetMatches() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Chat queries
export function useGetChat(recipientId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: ['chat', recipientId?.toString()],
    queryFn: async () => {
      if (!actor || !recipientId) return [];
      return actor.getChat(recipientId);
    },
    enabled: !!actor && !actorFetching && !!recipientId,
    refetchInterval: 3000, // Poll every 3 seconds
    retry: 1,
    retryDelay: 1000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { recipientId: Principal; content: string }) => {
      if (!actor) throw new Error('Actor no disponible');
      await actor.sendMessage(data.recipientId, data.content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', variables.recipientId.toString()] });
    },
    onError: (error: Error) => {
      toast.error('Error al enviar mensaje: ' + error.message);
    },
  });
}
