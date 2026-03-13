"use client";

import { Paper, Center, ActionIcon, ThemeIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function NewPetCard() {
    const router = useRouter();
    return (
        <Paper
            withBorder
            bg={"white"}
            component="button"
            onClick={() => {
                router.push("/v1/pets/new");
            }}
            className=" z-10 cursor-pointer  w-80 group flex  items-center flex-col justify-center h-110"
            p={{ base: "sm", lg: "lg" }}
        >
            <Center className="h-full">
                <ThemeIcon
                    className="group-hover:scale-[1.05]"
                    size={"xl"}
                    radius={"xl"}
                    variant="gradient"
                >
                    <IconPlus size={20} stroke={1.5} />
                </ThemeIcon>
            </Center>
        </Paper>
    );
}
