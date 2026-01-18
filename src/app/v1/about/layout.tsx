import { Divider, Text } from "@mantine/core";
import { ReactNode } from "react";
import bg from "../../../../public/bg.svg";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <div
                className="w-full items-center flex-col bg-cover bg-center gap-4 flex justify-center bg-slate-700 h-52
            "
                style={{ backgroundImage: `url(${bg.src})` }}
            >
                <div className="flex h-8 w-max gap-8 text-white">
                    <Text>About</Text>
                    <Divider orientation="vertical" />
                    <Text>Pricing</Text>
                    <Divider orientation="vertical" />
                    <Text>Landing Page</Text>
                </div>
                <Text size="sm" c={"gray.6"} ta={"center"}>
                    © 2025 Education Purposes Only. This is a non-affiliated
                    academic capstone project for educational use only; it is
                    not an official system of Joseph and Mary Veterinary Clinic.
                </Text>
            </div>
        </>
    );
}
