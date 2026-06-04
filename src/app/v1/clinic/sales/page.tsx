import { auth } from "@/auth";
import SalesBarChart from "@/components/common/SalesBarchart";
import {
    getServices,
    getTransactionalLogs,
    salesPerService,
} from "@/lib/db/services";
import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import { unauthorized } from "next/navigation";

import {
    IconZoomCheckFilled,
    IconPill,
    IconShieldCheckFilled,
    IconHeartCheck,
    IconStethoscope,
} from "@tabler/icons-react";
import { AppointmentType } from "@/db/schema/appointments";
import ExportSales from "@/components/admin/sales/ExportSales";

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
    const transactionLogs = await getTransactionalLogs(from, to);

    console.log(transactionLogs);
    const services = await getServices();
    const serviceList = services.map((s) => ({ title: s.title, type: s.type }));

    const totals = serviceList.map((service) => {
        const totalRevenue = data.reduce(
            (sum, row) => sum + (row[service.title] || 0),
            0
        );
        const totalQty = data.reduce(
            (sum, row) => sum + (row[`${service.title}_qty`] || 0),
            0
        );

        return {
            serviceName: service.title,
            type: service.type,
            totalRevenue,
            totalQty,
        };
    });

    const grandTotalSales = totals.reduce(
        (sum, item) => sum + item.totalRevenue,
        0
    );
    const getServiceIcon = (type: AppointmentType, size: number = 20) => {
        switch (type) {
            case "CHECK_UP":
                return <IconZoomCheckFilled size={size} stroke={1.5} />;
            case "DEWORMING":
                return <IconPill size={size} stroke={1.5} />;
            case "VACCINATION":
                return <IconShieldCheckFilled size={size} stroke={1.5} />;
            case "GROOMING":
                return <IconHeartCheck size={size} stroke={1.5} />;
            default:
                return <IconStethoscope size={size} stroke={1.5} />;
        }
    };

    return (
        <Stack
            bg={"gray.0"}
            className="w-full h-screen gap-4 p-8 md:p-16 light:bg-gray-50"
        >
            <Group justify="space-between">
                <Title>Sales</Title>

                <Group>
                    <ExportSales
                        transactionData={transactionLogs}
                        summaryData={totals}
                        dateRange={{ from, to }}
                    />
                </Group>
            </Group>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Paper p="md" withBorder radius="md" shadow="xs" bg={"blue"}>
                    <Text size="xs" c="black" fw={700} tt="uppercase">
                        {" "}
                        Total sales
                    </Text>
                    <Text size="2rem" mt={"sm"} c={"white"} fw={700}>
                        {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                        }).format(grandTotalSales)}
                    </Text>
                </Paper>

                {totals.map((item) => (
                    <Paper
                        key={item.serviceName}
                        p="lg" // Increased padding for a more premium feel
                        withBorder
                        radius="md"
                        shadow="sm"
                        className="group relative overflow-hidden transition-all hover:shadow-md hover:border-blue-400"
                    >
                        <div className="absolute -right-3 -bottom-2 -rotate-20 text-gray-100 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-50">
                            {getServiceIcon(item.type || "", 100)}
                        </div>
                        <Group justify="space-between">
                            <Text
                                size="xs"
                                c="dimmed"
                                fw={700}
                                tt="uppercase"
                                lts="1px"
                            >
                                {item.serviceName}
                            </Text>

                            {/* Small Accent Icon */}
                            <div className="text-blue-500 opacity-60">
                                {getServiceIcon(item.type || "", 24)}
                            </div>
                        </Group>
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
