import BottomPattern from "@/components/common/BottomPattern";
import LayoutContent from "@/components/common/LayoutContent";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LayoutContent>
            {children}
            <BottomPattern />
        </LayoutContent>
    );
}
