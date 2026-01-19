"use client";

import { Paper, Center, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function NewPetCard() {
    const router = useRouter();
    return (
        <Paper
            withBorder
            bg={"white"}
            className=" z-10 w-96 group flex items-center flex-col justify-center h-125"
            p={{ base: "sm", lg: "lg" }}
        >
            <Center className="h-full">
                <ActionIcon
                    onClick={() => {
                        router.push("/v1/pets/new");
                    }}
                    className="group-hover:scale-[1.04]"
                    size={"xl"}
                    radius={"xl"}
                    variant="gradient"
                >
                    <IconPlus size={20} stroke={1.5} />
                </ActionIcon>
            </Center>
        </Paper>
    );
}
