"use client";

import {
    Group,
    Avatar,
    Space,
    Stack,
    Text,
    Title,
    ActionIcon,
    Container,
    Grid,
    Flex,
} from "@mantine/core";
import { IconGenderMale, IconDotsVertical } from "@tabler/icons-react";

export default function ProfileCardGroup(user: {
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    dateOfBirth?: string;
}) {
    return (
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
                <Text>Hinululu04@gmail.com</Text>
                <Group>
                    <Text c={"dimmed"}>{user.dateOfBirth} </Text>
                    <ActionIcon variant="transparent">
                        <IconGenderMale color="blue" size={20} />
                    </ActionIcon>
                </Group>
            </Stack>
            <div className=" flex justify-end flex-1 h-28">
                <ActionIcon variant="transparent">
                    <IconDotsVertical size={20} />
                </ActionIcon>
            </div>
        </div>
    );
}
