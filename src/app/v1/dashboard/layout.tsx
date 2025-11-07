import { ReactNode } from "react";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";
import MenuTab from "@/components/MenuTab";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <header className="flex w-full h-20  border-b border-gray-300 items-center flex-col">
                <div className="flex lg:w-5xl w-full px-8 justify-between  h-full  items-center">
                    <span>
                        <Logo size="md" />
                    </span>

                    <div className="md:flex hidden  gap-8">
                        <NavLink href="/v1/dashboard">Dashboard</NavLink>
                        <NavLink href="/v1/pets">Pets</NavLink>
                        <NavLink href="/v1/appointments">Appointments</NavLink>
                        <NavLink href="/v1/profile">Profile</NavLink>
                    </div>
                </div>
            </header>
            {children}
            <div className="fixed backdrop-blur-3xl h-16 -translate-x-1/2 rounded-3xl  md:hidden  bottom-2 left-1/2 overflow-clip w-[92%] z-10">
                <MenuTab />
            </div>
        </div>
    );
}
