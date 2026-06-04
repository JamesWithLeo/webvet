import { ReactNode } from "react";
import LayoutContent from "@/components/common/LayoutContent";
import BottomPattern from "@/components/common/BottomPattern";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LayoutContent>
            <BottomPattern />
            {children}
        </LayoutContent>
    );
}
