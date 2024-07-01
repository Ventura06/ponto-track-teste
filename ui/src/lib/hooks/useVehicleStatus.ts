import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../consts";
import { getVehicleStatusClientFetch } from "../fetchs";

export default function useVehiclesStatus() {
  return useQuery({
    queryKey: [QUERY_KEYS.VEHICLES_STATUS],
    queryFn: async () => await getVehicleStatusClientFetch(),
  });
}
