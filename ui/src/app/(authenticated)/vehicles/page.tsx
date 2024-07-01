import VehicleList from "@/components/lists/VehicleList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QUERY_KEYS } from "@lib/consts";
import { getVehiclesClientFetch } from "@lib/fetchs";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import AddVehicleButton from "./fragments/AddVehicle";

export default async function MePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.VEHICLES],
    queryFn: () => getVehiclesClientFetch(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full">
        <div className="flex lg:justify-between lg:items-center lg:flex-row flex-col gap-5 justify-center items-start">
          <div>
            <h1 className="text-xl font-semibold">Veículos cadastrados</h1>
            <p>Gerencie, cadastre e exclua veículos por aqui.</p>
          </div>
          <AddVehicleButton />
        </div>
        <Card className="lg:border-2 border-0 mt-6 lg:p-4 md:shadow-md p-0 mx-0 shadow-none">
          <CardHeader className="">
            <p className="text-xl">Listagem de Veículos</p>
          </CardHeader>
          <CardContent>
            <VehicleList />
          </CardContent>
        </Card>
      </div>
    </HydrationBoundary>
  );
}
