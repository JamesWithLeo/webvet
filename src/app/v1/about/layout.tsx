import { Divider, Button, Text } from "@mantine/core";
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
                <Button component={"a"} variant="transparent" c="white" href={"#"}>
                About</Button>
                    <Divider orientation="vertical" />
                <Button component={"a"} variant="transparent" c="white" href={"/v1/pricing"}>
                Pricing</Button>
                    <Divider orientation="vertical" />
                <Button component={"a"} variant="transparent" c="white" href={"/"}>
                Landing Page</Button>
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
