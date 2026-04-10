import {
    Stack,
    Text,
    Title,
    Group,
    Badge,
    Paper,
    Divider,
} from "@mantine/core";
import { notFound } from "next/navigation";
import { IconAlertCircle, IconCheck, IconTrash } from "@tabler/icons-react";

import InvoiceTable from "@/components/InvoiceTable";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import InvoiceDocumentWrapper from "@/components/common/InvoiceDocumentWrapper";
import { toTitleCase } from "@/lib/toTitleCase";
import { getUserById } from "@/lib/db/users";
import ProcessCashButton from "@/components/admin/invoice/ProcessCashButton";
import ProcessVoidButton from "@/components/admin/invoice/ProcessVoidButton";
import IssueRefundButton from "@/components/admin/invoice/IssueRefundButton";

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
                        <Group gap={"sm"}>
                            {(data.paymentStatus === "PAID" ||
                                data.paymentStatus === "REFUNDED") && (
                                <InvoiceDocumentWrapper
                                    data={data}
                                    fullName={toTitleCase(
                                        `${user.firstName} ${user.lastName}`
                                    )}
                                />
                            )}
                            {data.paymentStatus === "PAID" && (
                                <IssueRefundButton
                                    invoiceId={data.id}
                                    amount={data.totalAmount}
                                />
                            )}
                        </Group>
                    </Group>

                    <Stack gap={0}>
                        <Title order={4} c={"dimmed"}>
                            Billing Details
                        </Title>
                        <Text fw={500}>Invoice Id: {data.id}</Text>
                        <Text size="sm" c="dimmed">
                            {new Date(data.createdAt).toLocaleString("en-PH", {
                                timeZone: "Asia/Manila",
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </Text>
                        <Text>
                            Client:{" "}
                            <Text span fw={600}>
                                {toTitleCase(
                                    `${user.firstName} ${user.lastName}`
                                )}
                            </Text>
                        </Text>
                    </Stack>

                    <Stack w={1000}>
                        <Title order={4} c={"dimmed"}>
                            Billing Breakdown
                        </Title>
                        <InvoiceTable data={data} />

                        {/* Financial Summary Section */}
                        <Paper
                            withBorder
                            p="xl"
                            radius="lg"
                            mt="md"
                            bg="gray.0"
                        >
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">
                                        Subtotal
                                    </Text>
                                    <Text fw={500}>
                                        ₱
                                        {data.totalAmount.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                        )}
                                    </Text>
                                </Group>

                                {data.amountRefunded > 0 && (
                                    <Stack gap={4}>
                                        <Group justify="space-between" c="red">
                                            <Group gap="xs">
                                                <IconAlertCircle size={16} />
                                                <Text fw={700}>
                                                    Refunded (
                                                    {data.refundMethod})
                                                </Text>
                                            </Group>
                                            <Text fw={700}>
                                                - ₱
                                                {data.amountRefunded.toLocaleString(
                                                    undefined,
                                                    { minimumFractionDigits: 2 }
                                                )}
                                            </Text>
                                        </Group>
                                        <Text size="xs" c="dimmed" pl={24}>
                                            Reason: {data.refundReason}
                                        </Text>
                                    </Stack>
                                )}

                                <Divider my="sm" variant="dashed" />

                                <Group justify="space-between">
                                    <Title order={3}>Net Total</Title>
                                    <Title
                                        order={3}
                                        c={
                                            data.amountRefunded > 0
                                                ? "red"
                                                : "primary"
                                        }
                                    >
                                        ₱
                                        {data.netAmount.toLocaleString(
                                            undefined,
                                            { minimumFractionDigits: 2 }
                                        )}
                                    </Title>
                                </Group>
                            </Stack>
                        </Paper>
                    </Stack>

                    {/* Action & Status Section */}
                    <Stack align="end" w={"1000"} gap="md">
                        {data.paymentStatus === "UNPAID" &&
                            data.status === "COMPLETED" && (
                                <ProcessCashButton
                                    firstName={user.firstName!}
                                    invoiceId={data.id}
                                    email={user.email}
                                    pets={data.items.map((p) =>
                                        toTitleCase(p.petName!)
                                    )}
                                    total={data.totalAmount}
                                />
                            )}

                        {data.paymentStatus === "UNPAID" &&
                            data.status === "ARRIVED" && (
                                <ProcessVoidButton invoiceId={data.id} />
                            )}

                        <Stack gap={0} align="end">
                            <Text c={"gray"} size="xs" mb={4}>
                                Payment Status
                            </Text>
                            <Text
                                size="xl"
                                fw={"bolder"}
                                c={
                                    data.paymentStatus === "PAID"
                                        ? "primary"
                                        : data.paymentStatus === "REFUNDED"
                                          ? "red"
                                          : data.paymentStatus === "VOID"
                                            ? "dark"
                                            : "yellow"
                                }
                            >
                                {data.paymentStatus}
                            </Text>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    );
}
