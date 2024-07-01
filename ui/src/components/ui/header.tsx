"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@lib/actions";
import { User } from "@lib/models";
import logoHorizontal from "@public/logo-horizontal.png";
import {
  CarFrontIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage } from "./avatar";

export default function Header({ user }: { user: User }) {
  const handleLogout = async () => {
    await logoutUser();
  };
  return (
    <header className="flex h-20 w-full shrink-0 justify-between items-center px-4 md:px-6 bg-themeBlack-900">
      <Link href="/vehicles" className="items-center gap-2 flex w-[150px] ">
        <Image src={logoHorizontal} alt="Logo da empresa" className="w-full" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-center items-center gap-2 px-3 py-2 transition-colors cursor-pointer">
            <Avatar className="w-auto">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}`}
              />
            </Avatar>
            <span className="max-w-40 hidden lg:max-w-full whitespace-nowrap overflow-hidden text-ellipsis lg:block text-themeBlack-100">
              {user?.first_name} {user?.last_name}
            </span>
            <ChevronDownIcon className="h-4 w-4 text-themeYellow-500" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto">
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/me" className="flex justify-center items-center gap-2">
              <UserIcon className="text-themeYellow-900" /> Ver meu perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Link
              href="/vehicles"
              className="flex justify-center items-center gap-2"
            >
              <CarFrontIcon className="text-themeYellow-900" /> Gerenciar
              Veículos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex justify-start items-center gap-2"
            onClick={handleLogout}
          >
            <LogOutIcon className="text-themeYellow-900" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* </div> */}
    </header>
  );
}
