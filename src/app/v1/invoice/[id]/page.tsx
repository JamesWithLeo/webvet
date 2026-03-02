import { createPaymentInvoice } from "@/actions/payment";
import { auth } from "@/auth";
import BackToAppointment from "@/components/common/BackToAppointment";
import InvoiceTable from "@/components/InvoiceTable";
import ProcessPayment from "@/components/ProcessPayment";
import { getInvoiceWithDetails } from "@/lib/db/invoice";
import { Stack, Text, Title, Button, Group } from "@mantine/core";
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

    // const payAction = createPaymentInvoice.bind(null, invoiceId);

    return (
        <div className="flex items-center flex-col w-full">
            <Stack className="w-full max-w-7xl h-screen gap-8 p-16 light:bg-gray-50">
                <Group justify="left">
                    <BackToAppointment />
                </Group>
                <Stack gap={"xl"}>
                    <Group w={"1000"} justify="space-between">
                        <Title c={"primary"}>Invoice</Title>
                        {/* {data.status === "PAID" && (
                            <Button variant="default" disabled>
                                Download
                            </Button>
                        )} */}
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
                    {data.paymentStatus === "UNPAID" && (
                        <Stack align="end" w={"1000"}>
                            {/* <Button>Process Payment</Button> */}
                            <ProcessPayment invoiceId={invoiceId} />
                            {/* <form action={payAction} method="POST">
                                <ProcessPaymentButton />
                            </form> */}
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
                        // <Button variant="default" disabled>
                        //     Download
                        // </Button>
                    )}
                    {/* {data.status === "PAID" && (
                        <Stack align="end" w={"1000"}>
                            <Button>PAID</Button>
                        </Stack>
                    )} */}
                </Stack>
            </Stack>
        </div>
    );
}
