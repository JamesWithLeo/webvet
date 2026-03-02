import AdminCreateInvoiceTable from "@/components/admin/invoice/AdminCreateInvoiceTable";
import {
    getInvoiceAdminV2,
    getInvoiceFullDetailsAdmin,
} from "@/lib/db/invoice";
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
    const { id } = await params; // Invoice ID from URL

    const [invoiceRes, servicesGrouped] = await Promise.all([
        getInvoiceFullDetailsAdmin(id),
        getServicesGrouped(),
    ]);

    const { data, error } = invoiceRes;
    if (error || !data) notFound();

    // Everything is here in one object!
    const { invoice, user, pets } = data;
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
                invoice={invoice}
                allPets={allPets}
                pets={pets} // This comes directly from our joined query
                services={servicesGrouped}
            />
        </div>
    );
}
