"use client";

import { sexValues } from "@/db/schema/users";

import {
    Group,
    Avatar,
    Space,
    Stack,
    Text,
    Title,
    ActionIcon,
    Menu,
    MenuTarget,
    MenuDropdown,
    MenuItem,
    MenuDivider,
} from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";

import {
    IconGenderMale,
    IconDotsVertical,
    IconEdit,
    IconLogout,
} from "@tabler/icons-react";

import EditProfileModal from "./EditProfileModal";

export default function ProfileCardGroup(user: {
    firstName?: string | null;
    lastName?: string | null;
    photoUrl?: string | null;
    dateOfBirth?: string | null;
    email?: string | null;
    sex: (typeof sexValues)[number];
}) {
    const [opened, { open, close }] = useDisclosure();
    return (
        <>
            <EditProfileModal opened={opened} close={close} />

            <div className="items-center flex gap-4 h-full">
                <Avatar radius={120} size={120} src={user.photoUrl}>
                    {user.firstName?.at(0)}
                    {user.lastName?.at(0)}
                </Avatar>
                <Space />
                <Stack
                    h={100}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="flex-end"
                    gap={0}
                >
                    <Title>
                        {user.firstName} {user.lastName}
                    </Title>
                    <Text>{user.email}</Text>
                    <Group>
                        <Text c={"dimmed"}>{user.dateOfBirth} </Text>
                        <ActionIcon variant="transparent">
                            <IconGenderMale color="blue" size={20} />
                        </ActionIcon>
                    </Group>
                </Stack>
                <div className=" flex justify-end flex-1 h-28">
                    <Menu shadow="md" width={180}>
                        <MenuTarget>
                            <ActionIcon variant="transparent">
                                <IconDotsVertical size={20} />
                            </ActionIcon>
                        </MenuTarget>
                        <MenuDropdown>
                            <MenuItem
                                rightSection={
                                    <IconEdit size={16} stroke={1.5} />
                                }
                                onClick={open}
                            >
                                Edit Profile
                            </MenuItem>
                            <MenuDivider />

                            <MenuItem
                                c={"white"}
                                bg={"red"}
                                rightSection={
                                    <IconLogout size={16} stroke={1.5} />
                                }
                            >
                                Logout
                            </MenuItem>
                        </MenuDropdown>
                    </Menu>
                </div>
            </div>
        </>
    );
}
