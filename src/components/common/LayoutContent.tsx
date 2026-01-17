import { Paper, Divider, Button } from "@mantine/core";
import LogoWithText from "./LogoWithText";
import Link from "next/link";
import HeaderBurger from "./HeaderBurger";
import UserAvatar from "./UserAvatar";
import { auth } from "@/auth";

export default async function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    return (
        <main>
            <Paper
                withBorder
                style={{ borderTop: 0, borderLeft: 0, borderRight: 0 }}
                className="h-16  z-20 sticky top-0 "
            >
                <div className="grid-cols-3 items-center grid w-full justify-between px-10 md:px-20 h-full">
                    <div className="w-full flex ">
                        <LogoWithText />
                    </div>
                    {session?.user && (
                        <div className="w-full  hidden lg:flex justify-center">
                            <Link
                                href="/v1/dashboard"
                                className="p-4 text-sm hover:bg-gray-50"
                            >
                                Home
                            </Link>
                            <Link
                                href="/v1/pets"
                                className=" hover:bg-gray-100 text-sm p-4"
                            >
                                Pets
                            </Link>
                            <Link
                                href="/v1/appointments"
                                className=" hover:bg-gray-100 text-sm p-4"
                            >
                                Appointments
                            </Link>
                            <Link
                                href="/v1/Pricing"
                                className=" hover:bg-gray-100 text-sm p-4"
                            >
                                Pricing
                            </Link>
                        </div>
                    )}

                    <div
                        className={`justify-end col-span-2 
                         ${session?.user ? " lg:col-span-1 " : ""}
                            items-center gap-2 flex`}
                    >
                        {session?.user && (
                            <>
                                <div className="lg:hidden h-full w-full flex justify-end gap-2">
                                    <HeaderBurger />
                                    <Divider orientation="vertical" />
                                </div>
                            </>
                        )}
                        <UserAvatar photoUrl={session?.user.photoUrl} />
                    </div>
                </div>
            </Paper>

            {children}
        </main>
    );
}
