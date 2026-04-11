import { auth } from "@/auth";
import BackToAppointment from "@/components/common/BackToAppointment";
import InvoiceTable from "@/components/InvoiceTable";
import ProcessPayment from "@/components/ProcessPayment";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import { Stack, Text, Title, Group, Paper, Divider } from "@mantine/core";
import { notFound } from "next/navigation";
import InvoiceDocumentWrapper from "@/components/common/InvoiceDocumentWrapper";
import { toTitleCase } from "@/lib/toTitleCase";
import { IconAlertCircle, IconReceiptRefund } from "@tabler/icons-react";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const invoiceId = (await params).id;

    const session = await auth();

    const data = await getInvoiceWithDetails(invoiceId);
    if (!data || !session) notFound();

    return (
        <div className="flex items-center flex-col w-full">
            <Stack className="w-full max-w-7xl h-screen gap-8 p-16 light:bg-gray-50">
                <Group justify="left">
                    <BackToAppointment />
                </Group>
                <Stack gap={"xl"}>
                    <Group justify="space-between">
                        <Title c={"primary"}>Invoice</Title>
                        {(data.paymentStatus === "PAID" ||
                            data.paymentStatus === "REFUNDED") && (
                            <InvoiceDocumentWrapper
                                data={data}
                                fullName={toTitleCase(
                                    `${session.user.firstName} ${session.user.lastName}`
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
                            {toTitleCase(
                                `${session.user.firstName} ${session.user.lastName}`
                            )}
                        </Text>
                    </Stack>

                    <Stack>
                        <Title order={4} c={"dimmed"}>
                            Billing Breakdown
                        </Title>
                        <InvoiceTable data={data} />
                    </Stack>

                    <Paper withBorder p="xl" radius="lg" mt="md" bg="gray.0">
                        <Stack gap="xs">
                            {/* The original purchase price */}
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Order Total
                                </Text>
                                <Text fw={500}>
                                    ₱{" "}
                                    {data.totalAmount.toLocaleString(
                                        undefined,
                                        { minimumFractionDigits: 2 }
                                    )}
                                </Text>
                            </Group>

                            {/* Refund section - softer styling for clients */}
                            {data.amountRefunded > 0 && (
                                <Stack gap={4}>
                                    <Group justify="space-between" c="gray.7">
                                        {" "}
                                        {/* Use a softer color than bright red */}
                                        <Group gap="xs">
                                            <IconReceiptRefund size={16} />
                                            <Text fw={600}>
                                                Refunded to {data.refundMethod}
                                            </Text>
                                        </Group>
                                        <Text fw={600}>
                                            - ₱{" "}
                                            {data.amountRefunded.toLocaleString(
                                                undefined,
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </Text>
                                    </Group>
                                    {/* Reason is usually omitted for clients unless it's a dispute, 
                    but if kept, use 'Note' instead of 'Reason' */}
                                    <Text size="xs" c="dimmed" pl={24}>
                                        Note: {data.refundReason}
                                    </Text>
                                </Stack>
                            )}

                            <Divider my="sm" variant="dashed" />

                            {/* The final amount the client actually spent */}
                            <Group justify="space-between">
                                <Title order={3}>Total Paid</Title>
                                <Title
                                    order={3}
                                    c="blue.9" // Standard brand color instead of "Admin Red"
                                >
                                    ₱{" "}
                                    {data.netAmount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </Title>
                            </Group>
                        </Stack>
                    </Paper>

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
                    {data.paymentStatus === "UNPAID" &&
                        data.status === "COMPLETED" && (
                            <Stack align="end">
                                <ProcessPayment invoiceId={invoiceId} />
                            </Stack>
                        )}
                </Stack>
            </Stack>
        </div>
    );
}
