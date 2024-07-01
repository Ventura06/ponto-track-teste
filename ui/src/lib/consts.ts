export const API_URL = process.env.API_URL || "http://localhost:8000";

export const BASE_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const QUERY_KEYS = {
  ME: "me",
  VEHICLES: "vehicles",
  VEHICLES_STATUS: "vehicles_status",
};

export const VEHICLE_STATUS = {
  1: "Parado",
  2: "Sem Sinal",
  3: "Em Movimento",
};

export const VEHICLE_STATUS_COLORS: Record<string, string> = {
  "1": "bg-themeGreen-500 hover:bg-themeGreen-600",
  "2": "bg-themeRed-500 hover:bg-themeRed-600",
  "3": "bg-themeYellow-500 hover:bg-themeRed-600",
};
