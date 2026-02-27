import { createPaymentInvoice } from "@/actions/payment";
import { auth } from "@/auth";
import InvoiceTable from "@/components/InvoiceTable";
import { ProcessPaymentButton } from "@/components/ProcessPaymentButton";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import { Stack, Text, Title, Button, Group } from "@mantine/core";
import { IconCornerLeftUp } from "@tabler/icons-react";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const invoiceId = (await params).id;

    const session = await auth();

    const data = await getInvoiceWithDetails(invoiceId);
    if (!data || !session) notFound();

    const payAction = createPaymentInvoice.bind(null, invoiceId);

    return (
        <div className="flex items-center flex-col w-full">
            <Stack className="w-full max-w-7xl h-screen gap-8 p-16 light:bg-gray-50">
                <Group justify="left">
                    <Button
                        variant="transparent"
                        c={"gray"}
                        size="xs"
                        leftSection={<IconCornerLeftUp size={18} />}
                    >
                        Back to appointments{" "}
                    </Button>
                </Group>
                <Stack gap={"xl"}>
                    <Group w={"1000"} justify="space-between">
                        <Title c={"primary"}>Invoice</Title>
                        {data.status === "PAID" && (
                            <Button variant="default" disabled>
                                Download
                            </Button>
                        )}
                    </Group>

                    <Stack gap={0}>
                        <Title order={4} c={"dimmed"}>
                            Billing Details
                        </Title>
                        <Text>Invoice Id: {data.id}</Text>
                        <Text>{new Date(data.createdAt).toLocaleString()}</Text>
                        <Text>
                            Client: {session.user.firstName}{" "}
                            {session.user.lastName}
                        </Text>
                    </Stack>

                    <Stack w={1000}>
                        <Title order={4} c={"dimmed"}>
                            Billing Breakdown
                        </Title>
                        <InvoiceTable
                            items={data.items}
                            total={data.totalAmount}
                        />
                    </Stack>
                    {data.status === "UNPAID" && (
                        <Stack align="end" w={"1000"}>
                            <form action={payAction} method="POST">
                                <ProcessPaymentButton />
                            </form>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </div>
    );
}
