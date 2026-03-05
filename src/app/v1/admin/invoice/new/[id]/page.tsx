import AdminCreateInvoiceTable from "@/components/admin/invoice/AdminCreateInvoiceTable";
import { getAppointmentFullDetailsAdmin } from "@/lib/db/appointments";
import { getAllPets } from "@/lib/db/pets";
import { getServicesGrouped } from "@/lib/db/services";
import { toTitleCase } from "@/lib/toTitleCase";
import { Avatar, Group, Stack, Text, Title } from "@mantine/core";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [servicesGrouped, appointmentFullDetail] = await Promise.all([
        getServicesGrouped(),
        getAppointmentFullDetailsAdmin(id),
    ]);

    const { data, error } = appointmentFullDetail;
    if (error || !data) notFound();

    const { user, pets, appointment } = data;
    const allPets = await getAllPets(user.id);

    return (
        <div className="w-full h-screen p-16 flex flex-col gap-4">
            <Title>Invoice</Title>
            <Stack gap={"xl"}>
                <Group>
                    <Avatar src={user.photoUrl}>
                        {user.firstName
                            ? user.firstName[0].toUpperCase()
                            : undefined}
                    </Avatar>
                    <Stack gap={0}>
                        <Text>
                            {toTitleCase(`${user.firstName} ${user.lastName}`)}
                        </Text>
                        <Text c={"dimmed"} size="xs">
                            {user.id}
                        </Text>
                    </Stack>
                </Group>
            </Stack>
            <AdminCreateInvoiceTable
                appointmentId={id}
                userId={user.id}
                allPets={allPets}
                pets={pets}
                services={servicesGrouped}
            />
        </div>
    );
}
