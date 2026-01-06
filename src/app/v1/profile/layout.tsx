import { ReactNode } from "react";
import LayoutContent from "@/components/LayoutContent";
import BottomPattern from "@/components/BottomPattern";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <LayoutContent>
            <div className="min-h-screen w-full relative md:px-16 px-4 py-4 flex gap-8 flex-col">
                <BottomPattern />
                {children}
            </div>
        </LayoutContent>
    );
}
