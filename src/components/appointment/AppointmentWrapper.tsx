"use client";

import {
    addAppointmentToCalendar,
    checkAppointmentFromCalendar,
} from "@/actions/calendar";
import {
    AppointmentType,
    JoinedAppointmentType,
} from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    ActionIcon,
    Avatar,
    AvatarGroup,
    Button,
    Group,
    Stack,
    Text,
    Title,
    Tooltip,
} from "@mantine/core";
import Link from "next/link";
import DetailRow from "../common/DetailRow";
import {
    IconCalendar,
    IconCheck,
    IconChevronLeft,
    IconCurrencyPeso,
    IconStatusChange,
    IconTag,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import LongItemFormatter from "@/lib/LongItemFormatter";
import CurrencyFormatter from "@/lib/CurrencyFormatter";

const googleCalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="24"
        height="24"
        viewBox="0 0 48 48"
    >
        <rect width="22" height="22" x="13" y="13" fill="#fff"></rect>
        <polygon
            fill="#1e88e5"
            points="25.68,20.92 26.688,22.36 28.272,21.208 28.272,29.56 30,29.56 30,18.616 28.56,18.616"
        ></polygon>
        <path
            fill="#1e88e5"
            d="M22.943,23.745c0.625-0.574,1.013-1.37,1.013-2.249c0-1.747-1.533-3.168-3.417-3.168 c-1.602,0-2.972,1.009-3.33,2.453l1.657,0.421c0.165-0.664,0.868-1.146,1.673-1.146c0.942,0,1.709,0.646,1.709,1.44 c0,0.794-0.767,1.44-1.709,1.44h-0.997v1.728h0.997c1.081,0,1.993,0.751,1.993,1.64c0,0.904-0.866,1.64-1.931,1.64 c-0.962,0-1.784-0.61-1.914-1.418L17,26.802c0.262,1.636,1.81,2.87,3.6,2.87c2.007,0,3.64-1.511,3.64-3.368 C24.24,25.281,23.736,24.363,22.943,23.745z"
        ></path>
        <polygon
            fill="#fbc02d"
            points="34,42 14,42 13,38 14,34 34,34 35,38"
        ></polygon>
        <polygon
            fill="#4caf50"
            points="38,35 42,34 42,14 38,13 34,14 34,34"
        ></polygon>
        <path
            fill="#1e88e5"
            d="M34,14l1-4l-1-4H9C7.343,6,6,7.343,6,9v25l4,1l4-1V14H34z"
        ></path>
        <polygon fill="#e53935" points="34,34 34,42 42,34"></polygon>
        <path fill="#1565c0" d="M39,6h-5v8h8V9C42,7.343,40.657,6,39,6z"></path>
        <path fill="#1565c0" d="M9,42h5v-8H6v5C6,40.657,7.343,42,9,42z"></path>
    </svg>
);
type Props = {
    data: {
        id: string;
        title: string;
        event_datetime: string;
        invoice: {
            id: string;
            paymentStatus: "UNPAID" | "PAID" | "VOID" | null | "REFUNDED";
            status:
                | "PENDING"
                | "ARRIVED"
                | "COMPLETED"
                | "CANCELLED"
                | "MISSED"
                | "IN_PROGRESS"
                | null;
            createdAt: Date;
        } | null;
        pets: {
            id: string;
            name: string;
            photoUrl: string | null;
            priceAtBooking: string;
            type: "CHECK_UP" | "GROOMING" | "VACCINATION" | "DEWORMING";
            title: string;
        }[];
    };
};

export default function AppointmentWrapper({
    data: { pets, title, event_datetime, id, invoice },
}: Props) {
    const router = useRouter();
    const { nameOfAllPets, totalAmount } = useMemo(() => {
        const totalAmount = pets.reduce((acc, pet) => {
            return acc + (Number(pet.priceAtBooking) || 0);
        }, 0);
        const uniquePets = Array.from(
            new Map(pets.map((pet) => [pet.id, pet])).values()
        );
        const nameOfAllPets = uniquePets
            .map((c) => toTitleCase(c.name))
            .join(", ");

        return { nameOfAllPets, totalAmount, uniquePets };
    }, [pets]);
    const expired = new Date() > new Date(event_datetime);

    const [loading, setLoading] = useState(false);
    const [existingToCalendar, setIsExistingToCalendar] =
        useState<boolean>(true);

    const longService = LongItemFormatter(pets.map((p) => toTitleCase(p.type)));

    const uniquePets = useMemo(() => {
        if (!pets) return [];

        return Array.from(new Map(pets.map((pet) => [pet.id, pet])).values());
    }, [pets]);

    const handleBooking = async () => {
        setLoading(true);
        const result = await addAppointmentToCalendar({
            id: id,
            title: title,
            start: new Date(event_datetime),
            end: new Date(event_datetime),
            description: `${longService} for ${nameOfAllPets} in Joseph & Mary Veterinary Clinic. This event is created via Web: https://www.josephmary.me`,
        });

        setLoading(false);
        if (result.success) {
            setIsExistingToCalendar(true);
            notifications.show({
                title: "Succesfully added to calendar!",
                autoClose: 6000,
                color: "teal",
                icon: <IconCheck size={20} />,

                withBorder: true,
                message:
                    "You can now view this appointment to your google calendar.",
            });
        }
    };
    const handleInvoiceClick = async () => {
        if (invoice) router.push(`/v1/invoice/${invoice.id}`);
    };

    const checkGoogleCalendar = async () => {
        const result = await checkAppointmentFromCalendar({
            id: id,
            title: title as string,
        });
        if (result.existing) {
            console.log("existing");
            setIsExistingToCalendar(true);
        } else {
            setIsExistingToCalendar(false);
        }
    };

    useEffect(() => {
        checkGoogleCalendar();
    }, []);

    return (
        <div className="w-full max-w-7xl gap-4 lg:gap-8 flex flex-col">
            <div className="flex w-full  justify-between">
                <div className="flex gap-2 ">
                    <ActionIcon
                        variant="transparent"
                        c={"dimmed"}
                        size={"input-sm"}
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <IconChevronLeft />
                    </ActionIcon>
                </div>
                {!existingToCalendar && !expired && (
                    <Button
                        variant="default"
                        size="sm"
                        radius={"md"}
                        rightSection={googleCalendarIcon()}
                        onClick={handleBooking}
                        loading={loading}
                        disabled={loading || existingToCalendar}
                    >
                        Add to Calendar
                    </Button>
                )}
            </div>
            <div className="flex gap-4 flex-col">
                <Group justify="space-between">
                    <Stack gap={0}>
                        <Title c={"primary"}>
                            {toTitleCase(title ?? nameOfAllPets)}
                        </Title>
                        <Text c={"dimmed"} size="xs">
                            {id}
                        </Text>
                    </Stack>
                    {!invoice?.id ? (
                        <Text c={"dimmed"} size="sm">
                            Not yet billed.
                        </Text>
                    ) : (
                        <>
                            {invoice?.paymentStatus !== "VOID" && (
                                <Button
                                    radius={"md"}
                                    variant="default"
                                    onClick={handleInvoiceClick}
                                >
                                    {invoice?.paymentStatus === "UNPAID" &&
                                        "Pay now"}
                                    {invoice?.paymentStatus === "PAID" &&
                                        "View Invoice"}
                                </Button>
                            )}
                        </>
                    )}
                </Group>
                <DetailRow
                    label="Title / Reason"
                    value={longService}
                    icon={<IconTag size={18} />}
                />
                <DetailRow
                    icon={<IconCalendar size={18} />}
                    label={expired ? "Expired on" : "Scheduled on"}
                    value={new Date(event_datetime).toString()}
                />
                <DetailRow
                    icon={<IconCurrencyPeso size={18} />}
                    label="Amount"
                    value={CurrencyFormatter(totalAmount)}
                />
                {invoice && invoice.status && (
                    <DetailRow
                        icon={<IconStatusChange size={18} />}
                        label={"Status"}
                        value={invoice.status}
                    />
                )}

                <div>
                    {!invoice && (
                        <Text>
                            Please bring your lovely pet(s): {nameOfAllPets}
                        </Text>
                    )}
                    <AvatarGroup mt={"sm"}>
                        {uniquePets.map((v) => (
                            <Tooltip
                                key={`${v.id}`}
                                label={toTitleCase(v.name)}
                                withArrow
                            >
                                <Avatar
                                    src={v.photoUrl}
                                    size={"lg"}
                                    radius="xl"
                                    color="blue"
                                    component={Link}
                                    href={`/v1/pets/${v.id}`}
                                >
                                    {v.name.charAt(0)}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                </div>
                {!invoice && (
                    <Text c={"red"} size="sm">
                        Note: Please arrived on time or 5 minutes early
                    </Text>
                )}
            </div>
        </div>
    );
}
