"use client";

import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    Flex,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import {
    IconCalendar,
    IconCurrencyPeso,
    IconTag,
    IconX,
} from "@tabler/icons-react";
import { toTitleCase } from "@/lib/toTitleCase";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import DetailRow from "../common/DetailRow";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import LongItemFormatter from "@/lib/LongItemFormatter";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import useAppointmentToPets from "@/lib/hooks/useAppointmnetToPetsAdmin";
import { AdminAppointment } from "@/db/schema/appointments";
import { useRouter } from "next/navigation";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { markAsArrivedAction } from "@/actions/invoice";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkAsArrived } from "@/lib/hooks/useMarkAsArrived";

type Props = {
    opened: boolean;
    close: () => void;
    selectedRow: AdminAppointment;
};

export default function AppointmentDrawerAdmin({
    opened,
    selectedRow,
    close,
}: Props) {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data } = useAppointmentToPets(selectedRow.id);
    const { handleMarkAsArrived, isPending, isSuccess, state } =
        useMarkAsArrived(close);

    const markAsPaid = markAsArrivedAction.bind(null);

    const { allService, totalAmount } = useMemo(() => {
        if (!data) return { allService: null, totalAmount: null };

        const allService = data.pets.map((p) => toTitleCase(p.type));

        const totalAmount = data.pets.reduce((acc, pet) => {
            return acc + (Number(pet.priceAtBooking) || 0);
        }, 0);
        return { allService: LongItemFormatter(allService), totalAmount };
    }, [data]);

    // const handleMarkAsArrived = async (record: AdminAppointment) => {
    //     modals.openConfirmModal({
    //         title: "Confirm Client Arrival",
    //         centered: true,
    //         radius: "lg",
    //         size: "md",
    //         children: (
    //             <Stack gap={0}>
    //                 <Text>
    //                     Are you sure you want to mark{" "}
    //                     <b>
    //                         {toTitleCase(
    //                             `${record.user.firstName} ${record.user.lastName}`
    //                         )}
    //                     </b>{" "}
    //                     as arrived?
    //                 </Text>
    //                 <Text size="sm" c="dimmed">
    //                     This will update the appointment status and generate an
    //                     initial invoice.
    //                 </Text>
    //             </Stack>
    //         ),
    //         labels: { confirm: "Confirm Arrival", cancel: "Go Back" },
    //         confirmProps: { color: "red", radius: "md" },
    //         onConfirm: async () => {
    //             startTransition(async () => {
    //                 formAction({
    //                     appointmentId: record.id,
    //                     userId: record.user.id,
    //                 });
    //             });
    //         },
    //     });
    // };
    const uniquePets = useMemo(() => {
        if (!data?.pets) return [];

        return Array.from(
            new Map(data.pets.map((pet) => [pet.petId, pet])).values()
        );
    }, [data?.pets]);

    return (
        <Drawer.Root
            opened={opened}
            onClose={close}
            position={isMobile ? "bottom" : "right"}
            closeOnClickOutside={true}
            closeOnEscape={true}
            size={isMobile ? "sm" : "md"}
            padding="xl"
        >
            <Drawer.Overlay />
            <Drawer.Content>
                <Drawer.Body
                    style={{ minHeight: "max-height", height: "auto" }}
                >
                    <Flex
                        mih={"100%"}
                        gap="md"
                        justify="flex-end"
                        align="flex-start"
                        direction="column"
                        wrap="nowrap"
                    >
                        <div className="flex gap-4 w-full h-full ">
                            <Avatar.Group spacing={"xs"}>
                                {uniquePets &&
                                    uniquePets.map((v) => (
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
                            </Avatar.Group>
                            <Box>
                                <Text size="xl" fw={700}>
                                    {toTitleCase(selectedRow.title)}{" "}
                                </Text>
                                <Text size="xs" c={"dimmed"}>
                                    Appointment ID: <br />
                                    {selectedRow.id}
                                </Text>
                            </Box>

                            <div className="flex-1 items-start w-full flex justify-end min-h-full h-full ">
                                <ActionIcon
                                    onClick={close}
                                    variant="white"
                                    c={"dimmed"}
                                    size={"xs"}
                                >
                                    <IconX size={20} stroke={1.5} />
                                </ActionIcon>
                            </div>
                        </div>

                        <Divider w={"100%"} />

                        <Stack gap="lg">
                            {allService && (
                                <DetailRow
                                    icon={<IconTag size={18} />}
                                    label="Service Type"
                                    value={allService}
                                />
                            )}
                            <DetailRow
                                icon={<IconCalendar size={18} />}
                                label="Scheduled For"
                                value={selectedRow.event_datetime}
                            />

                            <DetailRow
                                icon={<IconCurrencyPeso size={18} />}
                                label="Amount"
                                value={CurrencyFormatter(totalAmount)}
                            />
                        </Stack>
                        {!selectedRow.invoice ? (
                            <Button
                                fullWidth
                                mt={"lg"}
                                variant="default"
                                onClick={() => {
                                    handleMarkAsArrived(selectedRow);
                                }}
                                disabled={isSuccess || isPending}
                                loading={isPending}
                            >
                                Arrived & Create Invoice
                            </Button>
                        ) : (
                            <>
                                {selectedRow.invoice?.paymentStatus ===
                                    "PAID" && (
                                    <Button
                                        fullWidth
                                        mt={"lg"}
                                        variant="default"
                                        onClick={() => {
                                            router.push(`/v1/clinic/invoice`);
                                        }}
                                    >
                                        View Invoice
                                    </Button>
                                )}
                                {selectedRow.invoice.paymentStatus ===
                                    "UNPAID" && (
                                    <Button
                                        fullWidth
                                        mt={"lg"}
                                        variant="default"
                                        onClick={(e) => {
                                            router.push(
                                                `/v1/clinic/invoice/new/${selectedRow.id}`
                                            );
                                        }}
                                    >
                                        Generate invoice
                                    </Button>
                                )}
                            </>
                        )}
                    </Flex>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
}
