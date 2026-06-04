"use client";

import { Button, Group } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import EditProfileModal from "./EditProfileModal";
import { useDisclosure } from "@mantine/hooks";

export default function ProfileAction() {
    const [opened, { open, close }] = useDisclosure();
    return (
        <>
            <EditProfileModal opened={opened} close={close} />
            <Group justify="flex-end">
                <Button variant="default" onClick={open} radius={"md"}>
                    Edit profile
                </Button>
                <Button
                    bg={"red"}
                    radius={"md"}
                    onClick={() => {
                        signOut({ redirectTo: "/" });
                    }}
                    rightSection={<IconLogout size={18} />}
                >
                    Log out
                </Button>
            </Group>
        </>
    );
}
