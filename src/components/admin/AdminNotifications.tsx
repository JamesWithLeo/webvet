"use client";

import {
    Avatar,
    Divider,
    Group,
    Paper,
    Space,
    Stack,
    Text,
} from "@mantine/core";

function NotificationCard({
    firstName,
    activiy,
}: {
    firstName: string;
    activiy: string;
}) {
    return (
        <Paper p={"md"} radius={"md"}>
            <Divider />
            <Space h={"sm"} />
            <Group justify="space-between">
                <Group>
                    <Avatar />
                    <Stack gap={0}>
                        <Text>{firstName}</Text>
                        <Text size="xs">{activiy}</Text>
                    </Stack>
                </Group>
                <Text c={"dimmed"} size="xs">
                    2 mins ago
                </Text>
            </Group>
        </Paper>
    );
}
export default function AdminNotificatons() {
    return (
        <Paper withBorder className="w-full flex p-4 col-span-1 row-span-2">
            <h1 className="font-bold text-sm text-gray-500">NOTIFICATONS</h1>
            <Stack gap={0}>
                <NotificationCard
                    firstName="James Leo Ocampo"
                    activiy="Added appointment"
                />
                <NotificationCard
                    firstName="Abegail Paral"
                    activiy="Added pet"
                />
                <NotificationCard
                    firstName="Darelle Laizon"
                    activiy="Paid appointment"
                />
                <NotificationCard
                    firstName="Venus angela reno"
                    activiy="Added appointment"
                />
            </Stack>
        </Paper>
    );
}
