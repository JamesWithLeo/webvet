import { auth } from "@/auth";
import AppointmentCard from "@/components/appointment/AppointmentCard";
import AppointmentController from "@/components/appointment/AppointmentController";
import { JoinedAppointmentType } from "@/db/schema/appointments";
import { getAppointments } from "@/lib/db/appointments";
import { Group, Stack, Title } from "@mantine/core";
import { unauthorized } from "next/navigation";

export default async function AppointmentPage() {
    const session = await auth();
    if (!session?.user.id) unauthorized();
    const appointments = await getAppointments({ id: session.user.id });
    const groupedAppointments = appointments.reduce<
        Record<number, JoinedAppointmentType[]>
    >((acc, appt) => {
        const year = new Date(appt.event_datetime).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(appt);
        return acc;
    }, {});

    const sortedYears = Object.keys(groupedAppointments).sort(
        (a, b) => Number(b) - Number(a)
    );

    return (
        <>
            <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
                <div className="min-h-screen w-full relative md:p-16 px-4 flex gap-8 flex-col">
                    <AppointmentController />
                    {sortedYears.map((year) => (
                        <Stack key={year}>
                            <Title c={"dimmed"}>{year}</Title>
                            <Group>
                                {groupedAppointments[Number(year)].map((v) => (
                                    <AppointmentCard key={v.id} {...v} />
                                ))}
                            </Group>
                        </Stack>
                    ))}
                    {/* {appointments.map((v) => (
                            <AppointmentCard
                                title={v.title}
                                id={v.id}
                                pets={v.pets}
                                type={v.type}
                                created_at={v.created_at}
                                expiredNotication={v.expiredNotication}
                                incomingNotification={v.incomingNotification}
                                event_datetime={v.event_datetime}
                            />
                        ))} */}
                </div>
            </div>
        </>
    );
}
