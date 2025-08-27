import { useQuery } from "@tanstack/react-query";

interface FoundingMemberStats {
  foundingMemberCount: number;
  totalSignups: number;
  spotsRemaining: number;
  contestProgress: number;
}

export function useFoundingMembers() {
  const { data, isLoading } = useQuery<FoundingMemberStats>({
    queryKey: ["/api/founding-members/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  return {
    stats: data,
    isLoading,
    foundingMemberCount: data?.foundingMemberCount || 0,
    totalSignups: data?.totalSignups || 0,
    spotsRemaining: Math.max(0, 100 - (data?.foundingMemberCount || 0)),
    contestProgress: ((data?.totalSignups || 0) / 250) * 100,
    isFoundingMemberSpotAvailable: (data?.foundingMemberCount || 0) < 100,
    isContestActive: (data?.totalSignups || 0) < 250,
  };
}