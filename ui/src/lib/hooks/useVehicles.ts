import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../consts";
import { getVehiclesClientFetch } from "../fetchs";

export default function useVehicles(params: [string, string][] = []) {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLES, params],
    queryFn: async () => await getVehiclesClientFetch(params),
  });
}
