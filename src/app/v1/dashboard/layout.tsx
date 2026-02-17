import { ReactNode } from "react";
import LayoutContent from "@/components/common/LayoutContent";
import { Stack } from "@mantine/core";

export default function Layout({
    children,
    // activity,
}: {
    children: ReactNode;
    activity: ReactNode;
}) {
    return (
        <>
            <LayoutContent>
                <div className="flex items-center w-full h-screen  flex-col   md:px-16 px-4">
                    <Stack className=" border-x p-4 w-full h-full  min-h-full flex  gap-2  ">
                        {/* {activity} */}
                        {children}
                    </Stack>
                </div>
            </LayoutContent>
        </>
    );
}
