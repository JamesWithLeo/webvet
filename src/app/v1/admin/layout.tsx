import AdminNav from "@/components/admin/AdminNav";
import BottomPattern from "@/components/common/BottomPattern";
import Providers from "../Provider";
import { auth } from "@/auth";
import { unauthorized } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (session?.user.role !== "admin" && session?.user.role !== "staff")
        unauthorized();
    return (
        <Providers>
            <main
                className="flex h-screen overflow-hidden  w-full "
                suppressHydrationWarning
            >
                <AdminNav />
                <main className="flex-1 overflow-y-auto">{children}</main>

                <BottomPattern />
            </main>
        </Providers>
    );
}
