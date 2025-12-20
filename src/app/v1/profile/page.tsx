import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect } from "next/navigation";
import {
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
    IconCalendarEvent,
    IconCalendarSad,
    IconPaw,
    IconPawFilled,
    IconPawOff,
} from "@tabler/icons-react";
import ProfileCardGroup from "@/components/ProfileCardGroup";
import LogoutButton from "@/components/LogoutButton";

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
                className="relative max-w-3xl"
            >
                <Stack gap={"xl"}>
                    <ProfileCardGroup
                        firstName={session.user.firstName}
                        lastName={session.user.lastName}
                        dateOfBirth={session.user.dateOfBirth}
                        photoUrl={session.user.photoUrl}
                    />
                    <SimpleGrid cols={2}>
                        <Stack c={"primary"}>
                            <Group>
                                <IconPawOff stroke={1.5} />
                                <Text fw={500}>Deceased pets: 1</Text>
                            </Group>
                            <Group>
                                <IconPaw stroke={1.5} />
                                <Text fw={500}>Alive pets: 3</Text>
                            </Group>
                            <Group>
                                <IconPawFilled stroke={1.5} />
                                <Text fw={500}>Total pets: 4</Text>
                            </Group>
                        </Stack>
                        {/* <Divider orientation="vertical" w={"auto"} /> */}
                        <Stack c={"primary"}>
                            <Group>
                                <IconCalendarEvent stroke={1.5} />
                                <Text fw={500}>Pending appointments: 1</Text>
                            </Group>
                            <Group>
                                <IconCalendarCheck stroke={1.5} />
                                <Text fw={500}>Total appointments: 10</Text>
                            </Group>
                            <Group>
                                <IconCalendarSad stroke={1.5} />
                                <Text fw={500}>Missed appointments: 0</Text>
                            </Group>
                        </Stack>
                    </SimpleGrid>
                </Stack>
            </Paper>
            <Paper
                withBorder
                p={"xl"}
                w={"100%"}
                className="relative max-w-3xl"
            >
                <Title order={5} c={"dimmed"}>
                    Settings
                </Title>
                <Space h={"md"} />
                <Stack>
                    <Group w={"100%"} justify="space-between">
                        <Text>Email Notification</Text>
                        <Switch size="lg" onLabel="ON" offLabel="OFF" />
                    </Group>
                    <Group w={"100%"} justify="space-between">
                        <Text>Play Loading Animation</Text>
                        <Switch size="lg" onLabel="ON" offLabel="OFF" />
                    </Group>
                </Stack>
            </Paper>
            <SimpleGrid w={"100%"} cols={2} className="max-w-3xl">
                <Button maw={"100%"} variant="light" c={"primary.9"}>
                    Forgot Password
                </Button>
                <LogoutButton color="red" label={"Logout"} />
            </SimpleGrid>
        </div>
    );
}
