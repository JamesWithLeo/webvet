import { ReactNode } from "react";
import LayoutContent from "@/components/common/LayoutContent";
import { Stack } from "@mantine/core";
import BottomPattern from "@/components/common/BottomPattern";

export default function Layout({
    children,
    // activity,
}: {
    children: ReactNode;
    // activity: ReactNode;
}) {
    return (
        <>
            <LayoutContent>
                <div className="flex items-center w-full h-screen  flex-col   md:px-16 p-4">
                    <Stack className=" border-x  w-full h-full  min-h-full flex  gap-2  ">
                        {/* {activity} */}
                        {children}
                    </Stack>
                </div>
                <BottomPattern />
            </LayoutContent>
        </>
    );
}
