import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useVehiclesStatus from "@/lib/hooks/useVehicleStatus";
import { cn } from "@/lib/utils";
import { reuleaux } from "ldrs";
import { useMemo } from "react";

reuleaux.register();
type VehicleFilterProps = {
  className?: string;
  handleDispatch: (type: string, payload: any) => void;
};

export default function VehicleFilter({
  className = "",
  handleDispatch,
}: VehicleFilterProps) {
  const { data: vehicleStatus, isLoading } = useVehiclesStatus();
  const vehicleStatusOptionsMemo = useMemo(
    () => vehicleStatus?.data,
    [vehicleStatus]
  );
  if (isLoading)
    return (
      <div className="col-span-12 flex justify-center items-center mb-10">
        <l-reuleaux
          size="30"
          stroke="5"
          stroke-length="0.15"
          bg-opacity="0.4"
          speed="1.2"
          color="#ffcc01"
        ></l-reuleaux>
      </div>
    );
  return (
    <div
      className={cn(
        `grid grid-cols-12 justify-center items-center gap-3 mb-3`,
        className
      )}
    >
      <div className="flex flex-col col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 gap-3">
        <Label>Vin:</Label>
        <Input
          placeholder="Digite o Vin"
          onChange={(e) =>
            setTimeout(() => handleDispatch("SET_VIN", e.target.value), 500)
          }
        />
      </div>

      <div className="flex flex-col col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 gap-3">
        <Label htmlFor="">Placa:</Label>
        <Input
          placeholder="Digite a placa"
          onChange={(e) =>
            setTimeout(
              () => handleDispatch("SET_LICENSE_PLATE", e.target.value),
              500
            )
          }
        />
      </div>

      <div className="flex flex-col col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 gap-3">
        <Label htmlFor="">Modelo:</Label>
        <Input
          placeholder="Digite o modelo"
          onChange={(e) =>
            setTimeout(() => handleDispatch("SET_MODEL", e.target.value), 500)
          }
        />
      </div>
      <div className="flex flex-col col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 gap-3">
        <Label htmlFor="">Status Atual do Veículo:</Label>
        <Select
          value={undefined}
          onValueChange={(value) => handleDispatch("SET_VEHICLE_STATUS", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value={"0"}>Todos</SelectItem>
              {vehicleStatusOptionsMemo?.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.vehicle_status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
