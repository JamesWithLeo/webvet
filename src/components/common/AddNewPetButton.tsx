"use client";

import { Button, MantineBreakpoint } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconDog } from "@tabler/icons-react";

type Props = {
    size: MantineBreakpoint;
};
export default function AddNewPetButton({ size }: Props) {
    const router = useRouter();
    return (
        <Button
            size={size}
            variant="default"
            radius={"md"}
            onClick={() => {
                router.push("/v1/pets/new");
            }}
            leftSection={<IconDog size={20} stroke={1.5} />}
        >
            Add Pet
        </Button>
    );
}
