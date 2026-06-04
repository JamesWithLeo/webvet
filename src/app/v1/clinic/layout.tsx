import AdminNav from "@/components/admin/AdminNav";
import Providers from "../Provider";
import { auth } from "@/auth";
import { unauthorized } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const role = session?.user.role;
    if (!role) unauthorized();
    if (role !== "admin" && role !== "staff" && role !== "vet") unauthorized();

    return (
        <Providers>
            <main
                className="flex h-screen overflow-hidden  w-full "
                suppressHydrationWarning
            >
                <AdminNav role={role} />
                <main className="w-full min-w-0 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </main>
        </Providers>
    );
}
