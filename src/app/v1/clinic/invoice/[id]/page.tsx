import InvoiceTable from "@/components/InvoiceTable";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import { Stack, Text, Title, Group, Button } from "@mantine/core";
import { notFound } from "next/navigation";
import InvoiceDocumentWrapper from "@/components/common/InvoiceDocumentWrapper";
import { toTitleCase } from "@/lib/toTitleCase";
import { getUserById } from "@/lib/db/users";
import ProcessCashButton from "@/components/admin/invoice/ProcessCashButton";
import ProcessVoidButton from "@/components/admin/invoice/ProcessVoidButton";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const invoiceId = (await params).id;

    const data = await getInvoiceWithDetails(invoiceId);
    if (!data) notFound();
    const [user] = await getUserById(data.userId);
    if (!user) notFound();

    return (
        <div className="flex items-center flex-col w-full">
            <Stack className="w-full max-w-7xl h-screen gap-8 p-16 light:bg-gray-50">
                <Stack gap={"xl"}>
                    <Group w={"1000"} justify="space-between">
                        <Title c={"primary"}>Invoice</Title>
                        {data.paymentStatus === "PAID" && (
                            <InvoiceDocumentWrapper
                                data={data}
                                fullName={toTitleCase(
                                    `${user.firstName} ${user.lastName}`
                                )}
                            />
                        )}
                    </Group>

                    <Stack gap={0}>
                        <Title order={4} c={"dimmed"}>
                            Billing Details
                        </Title>
                        <Text>Invoice Id: {data.id}</Text>
                        <Text>{new Date(data.createdAt).toLocaleString()}</Text>
                        <Text>
                            Client:{" "}
                            {toTitleCase(`${user.firstName} ${user.lastName}`)}
                        </Text>
                    </Stack>

                    <Stack w={1000}>
                        <Title order={4} c={"dimmed"}>
                            Billing Breakdown
                        </Title>
                        <InvoiceTable items={data.items} />
                    </Stack>
                    {data.paymentStatus === "UNPAID" &&
                        data.status === "COMPLETED" && (
                            <Stack align="end" w={"1000"}>
                                <ProcessCashButton invoiceId={data.id} />
                            </Stack>
                        )}
                    {data.paymentStatus === "UNPAID" &&
                        data.status === "ARRIVED" && (
                            <Stack align="end" w={"1000"}>
                                <ProcessVoidButton invoiceId={data.id} />
                            </Stack>
                        )}

                    {data.paymentStatus === "VOID" && (
                        <Stack gap={0} align="end" w={"1000"}>
                            <Text c={"gray"} size="xs">
                                Payment status
                            </Text>
                            <Text c={"dark"} size="xl" fw={"bolder"}>
                                VOID
                            </Text>
                        </Stack>
                    )}
                    {data.paymentStatus === "PAID" && (
                        <Stack gap={0} align="end" w={"1000"}>
                            <Text c={"gray"} size="xs">
                                Payment status
                            </Text>
                            <Text c={"primary"} size="xl" fw={"bolder"}>
                                PAID
                            </Text>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </div>
    );
}
