"use client";

import { Avatar, Space, Stack, Text, Title } from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";

import { toTitleCase } from "@/lib/toTitleCase";

export default function ProfileCardGroup(user: {
    firstName?: string | null;
    lastName?: string | null;
    photoUrl?: string | null;
    email?: string | null;
    id: string;
}) {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <>
            <div
                className={`items-center flex ${isMobile ? "gap-2" : "gap-4"} h-full`}
            >
                <Avatar
                    radius={120}
                    size={isMobile ? 60 : 120}
                    src={user.photoUrl}
                >
                    {user.firstName?.at(0)?.toUpperCase()}
                    {user.lastName?.at(0)?.toUpperCase()}
                </Avatar>
                <Space />
                <Stack
                    h={100}
                    bg="var(--mantine-color-body)"
                    align="stretch"
                    justify="flex-end"
                    gap={0}
                >
                    <Title order={isMobile ? 3 : 1}>
                        {toTitleCase(`${user.firstName} ${user.lastName}`)}
                    </Title>
                    <Text>{user.email}</Text>
                </Stack>

                {/* <div className=" flex justify-end flex-1 h-28">
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
                                onClick={() => {
                                    signOut({ callbackUrl: "/" });
                                }}
                                rightSection={
                                    <IconLogout size={16} stroke={1.5} />
                                }
                            >
                                Logout
                            </MenuItem>
                        </MenuDropdown>
                    </Menu>
                </div> */}
            </div>
        </>
    );
}
