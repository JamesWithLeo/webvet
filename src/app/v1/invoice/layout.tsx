import { ReactNode } from "react";
import LayoutContent from "@/components/common/LayoutContent";
import TopRightPattern from "@/components/common/TopRightPattern";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LayoutContent>
            <TopRightPattern />
            {children}
        </LayoutContent>
    );
}
