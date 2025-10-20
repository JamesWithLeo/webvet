import { ReactNode } from "react";
import Logo from "@/components/Logo";
import NavLink from "@/components/NavLink";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <header className="flex w-full h-20  border-b border-gray-300 items-center flex-col">
                <div className="flex w-5xl justify-between  h-full  items-center">
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
        </div>
    );
}
