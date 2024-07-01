import Header from "@/components/ui/header";
import { getUser } from "@lib/actions";
import { Response, User } from "@lib/models";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: Response<User> = await getUser();
  if (!user) return redirect("/");

  return (
    <div className="flex flex-col h-screen">
      <Header user={user.data} />
      <main className="flex-1 lg:p-4 p-2 mt-10 lg:mx-6 mx-2">{children}</main>
    </div>
  );
}
