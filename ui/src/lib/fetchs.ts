import { getAccessToken } from "./actions";
import { API_URL, BASE_HEADERS } from "./consts";
import { Response, User, Vehicle, VehicleStatus } from "./models";

export const getUserClientFetch = async (): Promise<Response<User>> => {
  const token = await getAccessToken();
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...BASE_HEADERS,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Erro ao buscar usuário");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar usuário");
  }
};

export const getVehiclesClientFetch = async (
  params: [string, string][] = []
): Promise<Response<Vehicle[]>> => {
  const searchParams = new URLSearchParams(params);
  const token = await getAccessToken();
  try {
    const response = await fetch(
      `${API_URL}/vehicles?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...BASE_HEADERS,
        },
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Erro ao buscar veículos");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar veículos");
  }
};

export const getVehicleStatusClientFetch = async (): Promise<
  Response<VehicleStatus[]>
> => {
  const token = await getAccessToken();
  try {
    const response = await fetch(`${API_URL}/vehicles-status`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...BASE_HEADERS,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Erro ao buscar status de veículos");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar status de veículos");
  }
};
