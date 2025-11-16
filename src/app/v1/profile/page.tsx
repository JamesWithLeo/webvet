import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect } from "next/navigation";
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Group,
    Paper,
    SimpleGrid,
    Space,
    Stack,
    Switch,
    Text,
    Title,
} from "@mantine/core";
import {
    IconCalendarCheck,
    IconCat,
    IconGenderMale,
    IconLogout,
} from "@tabler/icons-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/");
    }

    return (
        <div className="flex items-center gap-4 flex-col justify-center">
            <Paper
                withBorder
                p={"xl"}
                w={"100%"}
                className="relative max-w-2xl"
            >
                <Stack gap={"xl"}>
                    <Group>
                        <Avatar
                            radius={120}
                            size={120}
                            src={session.user.photoUrl}
                        >
                            {session.user.firstName?.at(0)}
                            {session.user.lastName?.at(0)}
                        </Avatar>
                        <Stack
                            h={100}
                            bg="var(--mantine-color-body)"
                            align="stretch"
                            justify="flex-end"
                            gap={0}
                        >
                            <Title>
                                {session.user.firstName} {session.user.lastName}
                            </Title>
                            <Group>
                                <Text c={"dimmed"}>
                                    {session.user.dateOfBirth}{" "}
                                </Text>
                                <ActionIcon variant="transparent">
                                    <IconGenderMale color="blue" size={20} />
                                </ActionIcon>
                            </Group>
                        </Stack>
                    </Group>
                    <Group c={"primary"}>
                        <IconCat stroke={1.5} />
                        <Text fw={500}>Total pets: 4</Text>
                        <Space />
                        <IconCalendarCheck stroke={1.5} />
                        <Text fw={500}>Total appointments: 10</Text>
                    </Group>
                </Stack>
            </Paper>
            <Paper
                withBorder
                p={"xl"}
                w={"100%"}
                className="relative max-w-2xl"
            >
                <Title order={5} c={"dimmed"}>
                    Settings
                </Title>
                <Space />
                <Stack>
                    <Group w={"100%"} justify="space-between">
                        <Text>Play Loading Animation</Text>
                        <Switch size="lg" onLabel="ON" offLabel="OFF" />
                    </Group>

                    <Group w={"100%"} justify="space-between">
                        <Text>Dark Mode</Text>
                        <Switch size="lg" onLabel="ON" offLabel="OFF" />
                    </Group>
                </Stack>
            </Paper>
            <SimpleGrid w={"100%"} cols={2} className="max-w-2xl">
                <Button maw={"100%"} variant="light" c={"primary.9"}>
                    Forgot Password
                </Button>
                <Button color="red">Logout</Button>
            </SimpleGrid>
        </div>
    );
}
