import { auth } from "@/auth";
import SalesBarChart from "@/components/common/SalesBarchart";
import { getServices, salesPerService } from "@/lib/db/services";
import { Paper, Stack, Text, Title } from "@mantine/core";
import { unauthorized } from "next/navigation";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string }>;
}) {
    const session = await auth();
    const role = session?.user.role;
    if (role !== "admin" && Boolean(role)) unauthorized();

    const { from, to } = await searchParams;

    const { data, keys } = await salesPerService(from, to);
    const services = await getServices();
    const serviceList = services.map((s) => s.title);

    const totals = serviceList.map((serviceName) => {
        const totalRevenue = data.reduce(
            (sum, row) => sum + (row[serviceName] || 0),
            0
        );
        const totalQty = data.reduce(
            (sum, row) => sum + (row[`${serviceName}_qty`] || 0),
            0
        );

        return { serviceName, totalRevenue, totalQty };
    });
    return (
        <Stack className="w-full h-screen gap-4 p-8 md:p-16 light:bg-gray-50">
            <Title>Sales</Title>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {totals.map((item) => (
                    <Paper
                        key={item.serviceName}
                        p="md"
                        withBorder
                        radius="md shadow='sm'"
                    >
                        <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                            {item.serviceName}
                        </Text>
                        <Text size="xl" fw={700}>
                            {new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: "PHP",
                            }).format(item.totalRevenue)}
                        </Text>
                        <Text size="sm" c="gray">
                            Total Quantity:{" "}
                            <span className="font-bold text-black">
                                {item.totalQty}
                            </span>
                        </Text>
                    </Paper>
                ))}
            </div>
            <SalesBarChart data={data} keys={keys} />
        </Stack>
    );
}
