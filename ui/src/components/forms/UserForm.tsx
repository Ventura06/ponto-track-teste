"use client";
import useMe from "@/lib/hooks/useMe";
import { updateUserFormSchema } from "@/lib/zodSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logoutUser, updateUser } from "@lib/actions";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function UserForm() {
  const { data: me, refetch } = useMe();
  const router = useRouter();
  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      first_name: me?.data?.first_name || "",
      last_name: me?.data?.last_name || "",
      email: me?.data?.email || "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  const onSubmit = useCallback(
    async (data: z.infer<typeof updateUserFormSchema>) => {
      toast
        .promise(
          updateUser(data),
          {
            loading: "Enviando seus dados...",
            success: "Dados registrados com sucesso!",
            error: "Erro ao editar, tente novamente!",
          },
          {
            duration: 1000,
          }
        )
        .then(async (res) => {
          if (res) {
            refetch();
          }
          if ((res && data.email !== me?.data.email) || data.new_password) {
            toast(
              "Como mudou sua senha ou email, você será deslogado por questões de segurança.",
              {
                icon: <InfoIcon className="text-themeYellow-700 w-10 h-10" />,
                duration: 5000,
              }
            );
            await logoutUser();
          }
        });
    },
    [me, refetch]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-12 space-y-4 w-full gap-5"
      >
        <Toaster position="top-right" />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Nome:</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Sobrenome:</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu Sobrenome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Senha Atual:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Digite sua Senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Nova Senha:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Digite sua Senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="col-span-12 lg:col-span-6">
              <FormLabel>Confirmar Senha:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Digite sua Senha"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-12 flex flex-col-reverse lg:flex-row justify-end gap-4 lg:pt-40 pb-5">
          <Button
            variant={"secondary"}
            type="button"
            className="lg:w-1/4 w-full"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" className="lg:w-1/4 w-full">
            Salvar informações
          </Button>
        </div>
      </form>
    </Form>
  );
}

UserForm.displayName = "UserForm";
