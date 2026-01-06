import { redirect } from "next/navigation";
import { Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import {
    IconCalendarCheck,
    IconCalendarEvent,
    IconCalendarSad,
    IconPaw,
    IconPawFilled,
    IconPawOff,
} from "@tabler/icons-react";
import ProfileCardGroup from "@/components/ProfileCardGroup";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function ProfilePage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/");
    }

    return (
        <SessionProvider>
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
                            email={session.user.email}
                            gender={session.user.gender}
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
                            <Stack c={"primary"}>
                                <Group>
                                    <IconCalendarEvent stroke={1.5} />
                                    <Text fw={500}>
                                        Pending appointments: 1
                                    </Text>
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
            </div>
        </SessionProvider>
    );
}
