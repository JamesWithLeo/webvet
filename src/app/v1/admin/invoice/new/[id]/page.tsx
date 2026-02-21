import AdminCreateInvoiceTable from "@/components/admin/invoice/AdminCreateInvoiceTable";
import { pets } from "@/db/schema/pets";
import {
    getAppointmentAdmin,
    getAppointmentToPetsAdmin,
} from "@/lib/db/appointments";
import { getServicesGrouped } from "@/lib/db/services";
import { toTitleCase } from "@/lib/toTitleCase";
import { Stack, Text, Title } from "@mantine/core";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    if (!id) notFound();

    const [appointmentRes, petsRes, services] = await Promise.all([
        getAppointmentAdmin(id),
        getAppointmentToPetsAdmin(id),
        getServicesGrouped(),
    ]);

    const { data: appointment, error: errorAppointment } = appointmentRes;
    const { data: petsData, error: errorPets } = petsRes;

    if (errorAppointment || errorPets || !appointment || !petsData) {
        notFound();
    }

    const { firstName, lastName, ...user } = appointment.user;

    return (
        <div className="w-full h-screen p-16 flex flex-col gap-4">
            <Title>Invoice</Title>
            <Stack>
                <Stack gap={0}>
                    <Text>{toTitleCase(`${firstName} ${lastName}`)}</Text>
                    <Text c={"dimmed"} size="xs">
                        {user.id}
                    </Text>
                </Stack>
                <AdminCreateInvoiceTable
                    pets={petsData.pets}
                    services={services}
                />
            </Stack>
        </div>
    );
}
