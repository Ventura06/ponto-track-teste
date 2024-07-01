import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../consts";
import { getUserClientFetch } from "../fetchs";

export default function useMe() {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => await getUserClientFetch(),
  });
}
