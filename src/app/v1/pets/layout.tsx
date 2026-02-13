import { ReactNode } from "react";
import LayoutContent from "@/components/common/LayoutContent";
import Providers from "../Provider";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LayoutContent>
            <Providers>{children}</Providers>
        </LayoutContent>
    );
}
