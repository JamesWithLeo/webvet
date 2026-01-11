"use client";

import {
    Button,
    Card,
    Divider,
    Flex,
    Group,
    NumberFormatter,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { isPast } from "date-fns";
import { useRouter } from "next/navigation";

const DogSvg = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-dog"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11 5h2" />
            <path d="M19 12c-.667 5.333 -2.333 8 -5 8h-4c-2.667 0 -4.333 -2.667 -5 -8" />
            <path d="M11 16c0 .667 .333 1 1 1s1 -.333 1 -1h-2z" />
            <path d="M12 18v2" />
            <path d="M10 11v.01" />
            <path d="M14 11v.01" />
            <path d="M5 4l6 .97l-6.238 6.688a1.021 1.021 0 0 1 -1.41 .111a.953 .953 0 0 1 -.327 -.954l1.975 -6.815z" />
            <path d="M19 4l-6 .97l6.238 6.688c.358 .408 .989 .458 1.41 .111a.953 .953 0 0 0 .327 -.954l-1.975 -6.815z" />
        </svg>
    );
};

const CatSvg = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={120}
            height={120}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-cat"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 3v10a8 8 0 1 1 -16 0v-10l3.432 3.432a7.963 7.963 0 0 1 4.568 -1.432c1.769 0 3.403 .574 4.728 1.546l3.272 -3.546z" />
            <path d="M2 16h5l-4 4" />
            <path d="M22 16h-5l4 4" />
            <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            <path d="M9 11v.01" />
            <path d="M15 11v.01" />
        </svg>
    );
};
const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
export default function AppointmentCard({
    name,
    service,
    species,
    paid,
    doctor,
    date,
}: {
    name: string;
    service: string;
    species: "DOG" | "CAT";
    doctor: string;
    paid?: boolean;
    date: Date;
}) {
    const passed = isPast(date);
    const router = useRouter();
    const handleInvoiceClick = async () => {
        router.push("/v1/invoice");
        // const amount = 1000;
        // const email = "jamesocampo@gmail.com";
        // const response = await fetch("/api/xendit/checkout", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         amount: amount,
        //         email: email,
        //         currency: "PHP",
        //     }),
        // });
        // if (response.ok) {
        //     const invoiceData = await response.json();
        //     const invoiceUrl = invoiceData.invoice_url;
        //     window.location.href = invoiceUrl;
        // } else {
        //     const errorData = await response.json();
        //     console.error("Payment initiation failed:", errorData);
        //     alert("Could not start payment. Please try again.");
        // }
    };

    return (
        <Card withBorder w={500} h={200} p={"md"} radius={"md"}>
            <Card.Section
                p={"md"}
                className="group"
                component="a"
                href={`/v1/appointments/${name}`}
            >
                <div className="absolute group-hover:scale-[1.05] -right-7 text-gray-200 -rotate-12 -top-5">
                    {species === "DOG" ? <DogSvg /> : <CatSvg />}
                </div>
                <Group>
                    <Group>
                        <Stack
                            align="center"
                            className="rounded"
                            gap={0}
                            bg={passed ? "gray" : "primary"}
                            p={"sm"}
                        >
                            <Text c={passed ? "gray.7" : "primary.2"}>
                                {monthAbbreviations[date.getMonth()]}
                            </Text>
                            <Text c={"white"}>{date.getDate()}</Text>
                        </Stack>
                    </Group>
                    <Group>
                        <Stack justify="flex-end" gap={0}>
                            <Title c={"primary"} order={4} fw={"bold"}>
                                {name}&apos;s {service}
                            </Title>
                            <Text c={"dimmed"}>Thur 10:30 AM</Text>
                            <Text c={"dimmed"}>{doctor}</Text>
                        </Stack>
                    </Group>
                </Group>
            </Card.Section>
            <Card.Section px={"md"}>
                <Divider label={"Amount"} />
                <Flex c={"dimmed"} align={"center"} justify="space-between">
                    <Text>
                        <NumberFormatter
                            thousandSeparator
                            value={1000}
                            prefix="₱"
                            suffix=".00"
                        />
                    </Text>
                    {!paid ? (
                        <Button variant="default" onClick={handleInvoiceClick}>
                            Invoice
                        </Button>
                    ) : (
                        <Text c={"dimmed"} size="sm">
                            PAID
                        </Text>
                    )}
                </Flex>
            </Card.Section>
        </Card>
    );
}
