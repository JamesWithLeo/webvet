import { ReactNode } from "react";
import LayoutContent from "@/components/LayoutContent";
import { auth } from "@/auth";

export default async function Layout({ children }: { children: ReactNode }) {
    const session = await auth();
    console.log("session", session?.user);

    return (
        <LayoutContent photoUrl={session?.user.photoUrl}>
            {children}
        </LayoutContent>
    );
}
