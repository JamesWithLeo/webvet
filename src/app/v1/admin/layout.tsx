import AdminNav from "@/components/admin/AdminNav";
import BottomPattern from "@/components/common/BottomPattern";
import Providers from "../Provider";

export default function Layout({ children }: { children: React.ReactNode }) {
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
