import { ReactNode } from "react";
import LayoutContent from "@/components/LayoutContent";

export default function Layout({ children }: { children: ReactNode }) {
    return <LayoutContent>{children}</LayoutContent>;
}
