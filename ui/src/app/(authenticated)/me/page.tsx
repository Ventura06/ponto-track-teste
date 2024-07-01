import UserForm from "@/components/forms/UserForm";
import { Card } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/consts";
import { getUserClientFetch } from "@/lib/fetchs";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CancelAccount from "./fragments/CancelAccount";

export default async function MePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: getUserClientFetch,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full h-full">
        <div className="flex lg:justify-between lg:items-center lg:flex-row flex-col gap-5 justify-center items-start">
          <div>
            <h1 className="text-xl font-semibold">Meu perfil</h1>
            <p>Visualize suas informações e edite se desejar.</p>
          </div>
          <CancelAccount />
        </div>
        <Card className="lg:border-2 border-0 mt-6 lg:p-4 p-1">
          <UserForm />
        </Card>
      </div>
    </HydrationBoundary>
  );
}
