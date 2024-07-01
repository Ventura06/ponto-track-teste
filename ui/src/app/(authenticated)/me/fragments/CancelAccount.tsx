"use client";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@hooks/useMediaQuery";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteUser } from "@/lib/actions";
import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CancelAccount() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    toast.promise(
      deleteUser(),
      {
        loading: "Removendo seus dados😔...",
        success: "Dados removidos com sucesso 😭",
        error: "Erro ao deletar, tente novamente!",
      },
      {
        duration: 2000,
      }
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructiveOutline">Cancelar minha conta</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="">
            <DialogTitle className="flex items-center gap-1 text-themeRed-600">
              <CircleAlertIcon className="w-8 h-8" />
              <span> Atenção!</span>
            </DialogTitle>
            <DialogDescription className="font-semibold">
              <p>Tem certeza que deseja excluir sua conta?</p>
              <p>Você perderá todos os seus dados.</p>
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
      <DrawerTrigger asChild>
        <Button variant="destructiveOutline">Cancelar minha conta</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-1 text-themeRed-600">
            <CircleAlertIcon className="w-8 h-8" />
            <span> Atenção!</span>
          </DrawerTitle>
          <DrawerDescription className="font-semibold">
            <p>Tem certeza que deseja excluir sua conta?</p>
            <p>Você perderá todos os seus dados.</p>
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
