"use client";

import {
    ActionIcon,
    Avatar,
    Box,
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
import { AppointmentType } from "@/db/schema/appointments";
import { useMemo } from "react";
import LongItemFormatter from "@/lib/LongItemFormatter";
import CurrencyFormatter from "@/lib/CurrencyFormatter";

type Props = {
    opened: boolean;
    close: () => void;
    selectedAppointment: {
        id: string;
        title: string;
        event_datetime: string;
        pets: {
            id: string;
            name: string;
            photoUrl: string | null;
            priceAtBooking: string;
            type: AppointmentType;
            title: string;
        }[];
    };
};

export default function AppointmentDrawer({
    opened,
    close,
    selectedAppointment: { title, id, event_datetime, pets },
}: Props) {
    const isMobile = useMediaQuery("(max-width: 64rem)");

    const { allService, totalAmount } = useMemo(() => {
        const allService = pets.map((p) => toTitleCase(p.type));

        const totalAmount = pets.reduce((acc, pet) => {
            return acc + (Number(pet.priceAtBooking) || 0);
        }, 0);
        return { allService: LongItemFormatter(allService), totalAmount };
    }, [pets]);

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
                                {pets.map((v) => (
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
                                    {toTitleCase(title)}{" "}
                                </Text>
                                <Text size="xs" c={"dimmed"}>
                                    Appointment ID: <br />
                                    {id}
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
                            <DetailRow
                                icon={<IconTag size={18} />}
                                label="Service Type"
                                value={allService}
                            />
                            <DetailRow
                                icon={<IconCalendar size={18} />}
                                label="Scheduled For"
                                value={new Date(event_datetime).toString()}
                            />

                            <DetailRow
                                icon={<IconCurrencyPeso size={18} />}
                                label="Amount"
                                value={CurrencyFormatter(totalAmount)}
                            />
                        </Stack>
                    </Flex>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
}
