import { z } from "zod";

// zod regex to avoid numbers, special characters and spaces
const nameRegex = /^[a-zA-ZÀ-ú]+$/;

export const userFormSchema = z
  .object({
    first_name: z.string().min(3, {
      message: "O nome deve ter no mínimo 3 caracteres.",
    }),
    last_name: z.string().min(3, {
      message: "O sobrenome deve ter no mínimo 3 caracteres.",
    }),
    email: z.string().email({
      message: "Digite um email válido.",
    }),
    password: z.string().min(4, {
      message: "A senha deve ter no mínimo 4 caracteres.",
    }),
    confirm_password: z.string().min(4, {
      message: "A senha deve ter no mínimo 4 caracteres.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem.",
        path: ["confirm_password"],
      });
    }

    if (!nameRegex.test(data.first_name)) {
      ctx.addIssue({
        code: "custom",
        message:
          "O nome não pode conter números, caracteres especiais ou espaços.",
        path: ["first_name"],
      });
    }

    if (!nameRegex.test(data.last_name)) {
      ctx.addIssue({
        code: "custom",
        message:
          "O sobrenome não pode conter números, caracteres especiais ou espaços.",
        path: ["last_name"],
      });
    }
  });

export const updateUserFormSchema = z
  .object({
    first_name: z.string().min(3, {
      message: "O nome deve ter no mínimo 3 caracteres.",
    }),
    last_name: z.string().min(3, {
      message: "O sobrenome deve ter no mínimo 3 caracteres.",
    }),
    email: z.string().email({
      message: "Digite um email válido.",
    }),
    current_password: z.string().optional(),
    new_password: z.string().optional(),
    confirm_password: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem.",
        path: ["confirm_password"],
      });
    } else if (data.new_password && !data.current_password) {
      ctx.addIssue({
        code: "custom",
        message: "Digite sua senha atual para criar uma nova senha.",
        path: ["current_password"],
      });
    }

    if (!nameRegex.test(data.first_name)) {
      ctx.addIssue({
        code: "custom",
        message:
          "O nome não pode conter números, caracteres especiais ou espaços.",
        path: ["first_name"],
      });
    }

    if (!nameRegex.test(data.last_name)) {
      ctx.addIssue({
        code: "custom",
        message:
          "O sobrenome não pode conter números, caracteres especiais ou espaços.",
        path: ["last_name"],
      });
    }
  });

export const loginUserSchema = z.object({
  email: z.string().email({
    message: "Digite um email válido.",
  }),
  password: z.string(),
});

export const vehicleFormSchema = z
  .object({
    make: z
      .string()
      .min(2, {
        message: "A marca deve ter no mínimo 2 caracteres.",
      })
      .max(50, {
        message: "A marca deve ter no máximo 50 caracteres.",
      }),
    model: z
      .string()
      .min(2, {
        message: "O modelo deve ter no mínimo 2 caracteres.",
      })
      .max(50, {
        message: "O modelo deve ter no máximo 50 caracteres.",
      }),
    year: z.string().length(4, {
      message: "O ano deve ter 4 caracteres.",
    }),
    vin: z.string().length(17, {
      message: "O VIN deve ter 17 caracteres.",
    }),
    license_plate: z
      .string()
      .min(7, {
        message: "A placa deve ter no mínimo 7 caracteres.",
      })
      .max(10, {
        message: "A placa deve ter no máximo 10 caracteres.",
      }),
  })
  .transform((data) => {
    return {
      ...data,
      make: data.make.toUpperCase(),
      model: data.model.toUpperCase(),
      license_plate: data.license_plate.toUpperCase(),
    };
  });
