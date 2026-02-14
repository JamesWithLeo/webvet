"use client";

import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Divider,
    Drawer,
    Flex,
    Group,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { IconCalendar, IconInvoice, IconTag, IconX } from "@tabler/icons-react";
import { toTitleCase } from "@/lib/toTitleCase";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import DetailRow from "../common/DetailRow";

type Props = {
    opened: boolean;
    close: () => void;
    selectedAppointment: {
        id: string;
        title: string;
        event_datetime: string;
        serviceType:
            | "CHECK_UP"
            | "GROOMING"
            | "VACCINATION"
            | "DEWORMING"
            | null;
        serviceName: string;
        pets: {
            id: string;
            name: string;
            photoUrl: string | null;
        }[];
    };
};

export default function AppointmentDrawer({
    opened,
    close,
    selectedAppointment: {
        title,
        id,
        event_datetime,
        pets,
        serviceType,
        serviceName,
    },
}: Props) {
    const isMobile = useMediaQuery("(max-width: 64rem)");
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
                                    {toTitleCase(serviceName)}
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
                            {serviceType && (
                                <DetailRow
                                    icon={<IconTag size={18} />}
                                    label="Service Type"
                                    value={toTitleCase(serviceType)}
                                />
                            )}
                            <DetailRow
                                icon={<IconCalendar size={18} />}
                                label="Scheduled For"
                                value={new Date(event_datetime).toString()}
                            />
                        </Stack>

                        {/* <div className="h-full  justify-end  flex-col min-h-full flex grow w-full ">
                            <Group h={"100%"}>
                                <Button
                                    fullWidth
                                    leftSection={<IconInvoice size={16} />}
                                    variant="filled"
                                    // onClick={() => handlePayment(data.id)}
                                >
                                    Invoice
                                </Button>
                                <Button
                                    variant="default"
                                    color="red"
                                    fullWidth
                                    // onClick={openCancelConfirm}
                                    disabled={
                                        new Date(event_datetime) < new Date()
                                    }
                                >
                                    Cancel Appointment
                                </Button>
                            </Group>
                        </div> */}
                    </Flex>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
}
