"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { VEHICLE_STATUS_COLORS } from "@/lib/consts";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import useVehicles from "@/lib/hooks/useVehicles";
import { Vehicle } from "@/lib/models";
import { cn } from "@/lib/utils";
import { reuleaux } from "ldrs";
import {
  CarFrontIcon,
  EditIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "lucide-react";
import { useCallback, useMemo, useReducer, useState } from "react";

import VehicleForm from "../forms/VehicleForm";
import DeleteVehicleModal from "../modals/DeleteVehicleModal";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import VehicleFilter from "./filters/VehicleFilter";

reuleaux.register();

const defaultState = {
  vin: "",
  license_plate: "",
  model: "",
  vehicle_status: "",
};

const StateControlReducer = (
  state: Partial<Vehicle>,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_VIN":
      return { ...state, vin: action.payload };
    case "SET_LICENSE_PLATE":
      return { ...state, license_plate: action.payload };
    case "SET_MODEL":
      return { ...state, model: action.payload };
    case "SET_VEHICLE_STATUS":
      return {
        ...state,
        vehicle_status: action.payload === "0" ? "" : action.payload,
      };
    default:
      return state;
  }
};
export default function VehicleList() {
  const [state, dispatch] = useReducer(StateControlReducer, defaultState);
  const memoState = useMemo(() => state, [state]);
  const {
    data: vehicles,
    isLoading,
    refetch,
    isFetching,
  } = useVehicles([
    ["vin", memoState.vin],
    ["license_plate", memoState.license_plate],
    ["model", memoState.model],
    ["vehicle_status_id", memoState.vehicle_status],
  ]);

  const handleDispatch = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleEdit = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleDelete = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDelete(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setOpenDelete(false);
  }, []);

  const vehicleList = useMemo(() => {
    if (vehicles?.data?.length === 0) {
      return (
        <div className="col-span-12 w-full flex justify-center items-center">
          <p className="text-lg text-center font-semibold text-themeYellow-900">
            Nenhum veículo encontrado
          </p>
        </div>
      );
    }

    return vehicles?.data?.map((vehicle) => (
      <Card
        key={vehicle.vin}
        className="col-span-12 lg:col-span-4 md:col-span-6 bg-cardLinear"
      >
        <CardHeader>
          <div className="flex justify-between items-center gap-2 ">
            <p className="flex justify-start items-center gap-2 text-lg font-semibold">
              <CarFrontIcon className="text-themeYellow-700" /> {vehicle.make} -{" "}
              {vehicle.model}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVerticalIcon className="h-6 w-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 mr-5 md:mr-0">
                <DropdownMenuLabel>
                  {vehicle.make} - {vehicle.model}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                    <EditIcon className="text-themeYellow-900 mr-2 w-5 h-5" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(vehicle)}>
                    <TrashIcon className="text-themeRed-500 mr-2 w-5 h-5" />
                    <span className="text-themeRed-500">Remover</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 *:text-lg">
          <p className="text-sm flex flex-col md:flex-row">
            <span className="font-semibold mr-2">Ano:</span> {vehicle?.year}
          </p>
          <p className="text-sm flex flex-col md:flex-row">
            <span className="font-semibold mr-2">Placa:</span>{" "}
            {vehicle?.license_plate}
          </p>
          <p className="text-sm flex flex-col md:flex-row">
            <span className="font-semibold mr-2">VIN:</span>
            <span className="whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
              {vehicle?.vin}
            </span>
          </p>
          <p className="text-sm flex flex-col md:flex-row">
            <span className="font-semibold mr-2">Lat & Long:</span>
            <a
              className="text-themeYellow-900 hover:underline"
              href={`https://www.google.com/maps/@${vehicle.latitude},${vehicle.longitude},15.09z?entry=ttu`}
              target="_blank"
            >
              {vehicle?.latitude} | {vehicle?.longitude}
            </a>
          </p>
        </CardContent>

        <CardFooter>
          <div className="w-full flex justify-end items-center ">
            <div
              className={cn(
                "flex justify-center items-center w-auto h-10 px-8 text-white font-semibold rounded-full",
                VEHICLE_STATUS_COLORS[vehicle.vehicleStatusId]
              )}
            >
              {vehicle.vehicle_status}
            </div>
          </div>
        </CardFooter>
      </Card>
    ));
  }, [vehicles, handleEdit, handleDelete]);

  return (
    <div className="w-full grid grid-cols-12 gap-3">
      <VehicleFilter handleDispatch={handleDispatch} className="col-span-12" />
      {isLoading || isFetching ? (
        <div className="col-span-12 w-full flex justify-center items-center">
          <l-reuleaux
            size="37"
            stroke="5"
            stroke-length="0.15"
            bg-opacity="0.4"
            speed="1.2"
            color="#ffcc01"
          ></l-reuleaux>
        </div>
      ) : (
        vehicleList
      )}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[60%] max-w-[425px]">
            <DialogHeader className="flex justify-center">
              <DialogTitle>Edição de Veículos</DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={selectedVehicle}
              handleCancel={handleCancel}
              refetch={refetch}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="px-2 max-h-[96%]">
            <DrawerHeader className="text-left">
              <DialogHeader className="flex justify-center">
                <DialogTitle>Edição de Veículos</DialogTitle>
              </DialogHeader>
            </DrawerHeader>
            <VehicleForm
              vehicle={selectedVehicle}
              handleCancel={handleCancel}
              refetch={refetch}
            />
            <DrawerFooter className="pt-2"></DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      <DeleteVehicleModal
        open={openDelete}
        setOpen={setOpenDelete}
        handleCancel={handleCancelDelete}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
