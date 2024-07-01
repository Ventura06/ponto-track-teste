"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useMediaQuery from "@hooks/useMediaQuery";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteVehicle } from "@/lib/actions";
import { QUERY_KEYS } from "@/lib/consts";
import { Vehicle } from "@/lib/models";
import { useQueryClient } from "@tanstack/react-query";
import { CircleAlertIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type DeleteVehicleModalProps = {
  vehicle?: Vehicle;
  open: boolean;
  handleCancel: () => void;
  setOpen: (value: boolean) => void;
};

export default function DeleteVehicleModal({
  vehicle,
  open,
  handleCancel,
  setOpen,
}: DeleteVehicleModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const queryClient = useQueryClient();
  const handleDelete = async () => {
    toast
      .promise(
        deleteVehicle(vehicle?.vin ?? ""),
        {
          loading: "Removendo seu veículo😔...",
          success: "Veículo removido com sucesso 😭",
          error: "Erro ao deletar, tente novamente!",
        },
        {
          duration: 2000,
        }
      )
      .then((res) => {
        handleCancel();
        queryClient.refetchQueries({ queryKey: [QUERY_KEYS.VEHICLES] });
      });
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Toaster />

          <DialogHeader className="">
            <DialogTitle className="flex items-center gap-1 text-themeRed-600">
              <CircleAlertIcon className="w-8 h-8" />
              <span> Atenção!</span>
            </DialogTitle>
            <DialogDescription className="font-semibold">
              <p>
                Tem certeza que deseja excluir {vehicle?.make} -{" "}
                {vehicle?.model}?
              </p>
              <p>Você perderá todos os dados.</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse lg:flex-row justify-end gap-4 lg:pt-5 pb-5">
            <Button
              variant={"secondary"}
              onClick={handleCancel}
              className="w-full"
            >
              Cancelar
            </Button>
            <Button
              variant={"destructiveOutline"}
              onClick={handleDelete}
              className="w-full"
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <Toaster />
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-1 text-themeRed-600">
            <CircleAlertIcon className="w-8 h-8" />
            <span> Atenção!</span>
          </DrawerTitle>
          <DrawerDescription className="font-semibold">
            <p>
              Tem certeza que deseja excluir {vehicle?.make} - {vehicle?.model}?
            </p>
            <p>Você perderá todos os dados.</p>
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-2">
          <div className="flex flex-col-reverse lg:flex-row justify-end gap-4 lg:pt-5 pb-5">
            <Button
              variant={"secondary"}
              onClick={handleCancel}
              className="w-full"
            >
              Cancelar
            </Button>
            <Button
              variant={"destructiveOutline"}
              type="submit"
              onClick={handleDelete}
              className="w-full"
            >
              Excluir
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
