import { ReactNode } from "react";
import LayoutContent from "@/components/LayoutContent";
import BottomPattern from "@/components/BottomPattern";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LayoutContent>
            <BottomPattern />
            {children}
        </LayoutContent>
    );
}
