"use server";

import {
  loginUserSchema,
  updateUserFormSchema,
  userFormSchema,
  vehicleFormSchema,
} from "@lib/zodSchemas";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { API_URL, BASE_HEADERS } from "./consts";

export const registerUser = async (data: z.infer<typeof userFormSchema>) => {
  try {
    const register = await fetch(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { ...BASE_HEADERS },
    });

    if (register.ok) {
      return await loginUser({
        email: data.email,
        password: data.password,
      });
    } else {
      throw new Error("Erro ao registrar usuário");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao registrar usuário");
  }
};

export const createVehicle = async (
  data: z.infer<typeof vehicleFormSchema>
) => {
  try {
    const response = await fetch(`${API_URL}/vehicles`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        ...BASE_HEADERS,
      },
    });

    if (response.ok) {
      revalidatePath("/vehicles");
      return await response.json();
    } else {
      throw new Error("Erro ao criar veículo");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao criar veículo");
  }
};

export const updateVehicle = async (
  data: z.infer<typeof vehicleFormSchema>
) => {
  try {
    const response = await fetch(`${API_URL}/vehicles/${data.vin}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        ...BASE_HEADERS,
      },
    });

    if (response.ok) {
      revalidatePath("/vehicles");
      return await response.json();
    } else {
      throw new Error("Erro ao atualizar veículo");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar veículo");
  }
};

export const deleteVehicle = async (vin: string) => {
  if (!vin) return;
  try {
    const response = await fetch(`${API_URL}/vehicles/${vin}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        ...BASE_HEADERS,
      },
    });

    if (response.ok) {
      revalidatePath("/vehicles");
    } else {
      throw new Error("Erro ao deletar veículo");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar veículo");
  }
};

export const updateUser = async (
  data: z.infer<typeof updateUserFormSchema>
) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        ...BASE_HEADERS,
      },
    });

    if (response.ok) {
      revalidatePath("/me");
      return await response.json();
    } else {
      throw new Error("Erro ao atualizar usuário");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar usuário");
  }
};

export const loginUser = async (data: z.infer<typeof loginUserSchema>) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { ...BASE_HEADERS },
    });
    if (response.ok) {
      const result = await response.json();
      cookies().set("access_token", result.data.access_token, {
        httpOnly: true,
      });
      return result;
    } else {
      throw new Error("Erro ao logar");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUser = async () => {
  const token = await getAccessToken();
  if (!token) return null;
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
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        ...BASE_HEADERS,
      },
    });
    if (response.ok) {
      cookies().delete("access_token");
      return true;
    } else {
      throw new Error("Erro ao deslogar");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteUser = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        ...BASE_HEADERS,
      },
    });
    if (response.ok) {
      cookies().delete("access_token");
    } else {
      throw new Error("Erro ao deletar usuário");
    }
  } catch (error) {
    console.error(error);
  }

  redirect("/");
};

export const getAccessToken = async () => {
  const token = cookies().get("access_token")?.value;
  if (!token) return redirect("/");
  return token;
};
