export type Response<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export type User = {
  ulid: string;
  email: string;
  first_name: string;
  last_name: string;
};

export type Vehicle = {
  make: string;
  model: string;
  year: string;
  vin: string;
  license_plate: string;
  vehicle_status: string;
  vehicleStatusId: string;
  latitude?: string;
  longitude?: string;
};

export type VehicleStatus = {
  id: string;
  vehicle_status: string;
};
