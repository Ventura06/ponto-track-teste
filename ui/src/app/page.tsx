import LoginForm from "@/components/forms/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Image from "next/image";
import caminhoes from "../../public/caminhoes.png";
import logoCompleta from "../../public/logo-completa.png";
export default function Home() {
  return (
    <main className="w-full min-h-screen ">
      <div className="grid grid-cols-12 min-h-svh w-full  bg-themeBlack-100">
        <div className="col-span-12 hidden lg:flex lg:col-span-6 h-full flex-col justify-evenly items-center bg-themeBlack-900 rounded-e-[50%]">
          <Image
            src={logoCompleta}
            alt="Logo"
            className="w-1/2 -ml-10"
            priority
          />
          <Image
            src={caminhoes}
            alt="Imagem de caminhoes"
            className="w-4/5 self-start"
            priority
          />
        </div>
        <div className="col-span-12 lg:col-span-6 h-full flex flex-col justify-center items-start md:px-20 px-10 gap-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-5 bg-themeBlack-300 text-themeBlack-100 px-3 py-2 md:mb-10 rounded-full md:relative sticky top-3">
              <TabsTrigger className="tabs-trigger" value="login">
                Entrar
              </TabsTrigger>
              <TabsTrigger className="tabs-trigger" value="cadastrar">
                Cadastrar
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <div>
                <h1 className="text-4xl font-semibold mb-3">
                  Bem-vindo de Volta!
                </h1>
                <p className="text-balance mb-3">
                  Preencha as informações abaixo para monitorar sua frota.
                </p>
              </div>
              <LoginForm />
            </TabsContent>
            <TabsContent value="cadastrar">
              <div>
                <h1 className="text-4xl font-semibold mb-3">
                  Bem-vindo a Ponto Track!
                </h1>
                <p className="text-balance mb-3">
                  Preencha as informações abaixo para realiazar seu cadastro.
                </p>
              </div>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
