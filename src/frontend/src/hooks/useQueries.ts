import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Registration } from "../backend";
import { useActor } from "./useActor";

export function useGetAllRegistrations() {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRegistrationsSortedByTimestamp();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRegistration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (registration: Registration) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitRegistration(registration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}
