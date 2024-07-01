"use client";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@hooks/useMediaQuery";

import VehicleForm from "@/components/forms/VehicleForm";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { QUERY_KEYS } from "@/lib/consts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export default function AddVehicleButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Novo Veículo</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[60%] max-w-[425px]">
          <DialogHeader className="flex justify-center">
            <DialogTitle>Cadastrar de Veículos</DialogTitle>
          </DialogHeader>
          <VehicleForm
            handleCancel={handleCancel}
            refetch={() =>
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VEHICLES] })
            }
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default">Novo Veículo</Button>
      </DrawerTrigger>
      <DrawerContent className="px-2 max-h-[96%]">
        <DrawerHeader className="text-left">
          <DialogHeader className="flex justify-center">
            <DialogTitle>Cadastrar de Veículos</DialogTitle>
          </DialogHeader>
        </DrawerHeader>
        <VehicleForm
          handleCancel={handleCancel}
          refetch={() =>
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.VEHICLES] })
          }
        />
        <DrawerFooter className="pt-2"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
