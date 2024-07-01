"use client";
import { vehicleFormSchema } from "@/lib/zodSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicle, updateVehicle } from "@lib/actions";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function VehicleForm({
  vehicle,
  handleCancel,
  refetch,
}: {
  vehicle?: z.infer<typeof vehicleFormSchema>;
  handleCancel: () => void;
  refetch: unknown;
}) {
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: vehicle?.make ?? "",
      model: vehicle?.model ?? "",
      year: vehicle?.year ?? "",
      vin: vehicle?.vin ?? "",
      license_plate: vehicle?.license_plate ?? "",
    },
  });
  const onSubmit = async (data: z.infer<typeof vehicleFormSchema>) => {
    const loadingMessage = vehicle ? "Atualizando veículo" : "Criando veículo";
    const successMessage = vehicle
      ? "Veículo atualizado com sucesso!"
      : "Veículo criado com sucesso!";
    const errorMessage = vehicle
      ? "Erro ao atualizar veículo!"
      : "Erro ao criar veículo, tente novamente!";

    toast
      .promise(
        vehicle ? updateVehicle(data) : createVehicle(data),
        {
          loading: loadingMessage,
          success: successMessage,
          error: errorMessage,
        },
        {
          duration: 4000,
        }
      )
      .then(async (res) => {
        if (res) {
          typeof refetch === "function" && refetch();
          handleCancel();
        }
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-12 space-y-4 w-full overflow-y-auto gap-5"
      >
        <Toaster position="top-right" />
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Marca:</FormLabel>
              <FormControl>
                <Input placeholder="Digite o fabricante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Modelo:</FormLabel>
              <FormControl>
                <Input placeholder="Digite o modelo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Ano:</FormLabel>
              <FormControl>
                <Input placeholder="Digite o ano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>VIN:</FormLabel>
              <FormControl>
                <Input placeholder="Digite o VIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license_plate"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Placa:</FormLabel>
              <FormControl>
                <Input placeholder="Digite a placa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-12 flex flex-col-reverse lg:flex-row justify-end gap-4 lg:pt-40 pb-5">
          <Button
            variant={"secondary"}
            type="button"
            className="lg:w-1/4 w-full"
            onClick={() => handleCancel()}
          >
            Cancelar
          </Button>
          <Button type="submit" className="lg:w-auto w-full">
            Salvar informações
          </Button>
        </div>
      </form>
    </Form>
  );
}
VehicleForm.displayName = "VehicleForm";
