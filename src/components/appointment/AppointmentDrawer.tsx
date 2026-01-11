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
    ThemeIcon,
    Tooltip,
} from "@mantine/core";
import {
    IconCalendar,
    IconClock,
    IconInvoice,
    IconTag,
    IconX,
} from "@tabler/icons-react";
import { toTitleCase } from "@/lib/toTitleCase";
import { useMediaQuery } from "@mantine/hooks";
import { AppointmentPetMergeType } from "@/db/schema/appointments";
import Link from "next/link";
type Props = {
    opened: boolean;
    close: () => void;
    selectedAppointment: AppointmentPetMergeType;
};
export default function AppointmentDrawer({
    opened,
    close,
    selectedAppointment: {
        title,
        type,
        name,
        id,
        breed,
        photoUrl,
        petId,
        event_datetime,
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
                {/* <Drawer.Header>
                    <Drawer.Title>Drawer title</Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header> */}
                <Drawer.Body
                    style={{ minHeight: "max-height", height: "100%" }}
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
                            <Avatar.Group>
                                <Tooltip label={toTitleCase(name)} withArrow>
                                    <Avatar
                                        src={photoUrl}
                                        size={"lg"}
                                        radius="xl"
                                        color="blue"
                                        component={Link}
                                        href={`/v1/pets/${petId}`}
                                    >
                                        {name.charAt(0)}
                                    </Avatar>
                                </Tooltip>
                            </Avatar.Group>
                            <Box>
                                <Text size="xl" fw={700}>
                                    {toTitleCase(
                                        title ?? `${type} for ${name}`
                                    )}
                                </Text>
                                <Text size="xs" c={"dimmed"}>
                                    Appointment ID: <br />
                                    {id}
                                </Text>
                            </Box>

                            <div className="flex-1 items-start w-full flex justify-end min-h-full h-full ">
                                {/* <Menu shadow="md" withArrow width={"250"}>
                            <Menu.Target>
                                <IconDotsVertical stroke={1.5} />
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Pet Menu</Menu.Label>
                                <Menu.Item
                                    leftSection={
                                        <IconCat size={20} stroke={1.5} />
                                    }
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconLogs size={20} stroke={1.5} />
                                    }
                                >
                                    History
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Label>Action</Menu.Label>
                                <Menu.Item
                                    color="primary"
                                    leftSection={
                                        <IconPlus size={20} stroke={1.5} />
                                    }
                                >
                                    New Appointment
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu> */}
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
                            {/* <DetailRow
                        icon={<IconTag size={18} />}
                        label="Purpose / Title"
                        value={title || "No title provided"}
                    /> */}
                            <DetailRow
                                icon={<IconCalendar size={18} />}
                                label="Service Type"
                                value={toTitleCase(type)}
                            />
                            <DetailRow
                                icon={<IconClock size={18} />}
                                label="Scheduled For"
                                value={new Date(event_datetime).toString()}
                            />
                        </Stack>

                        <div className="h-full  justify-end  flex-col min-h-full flex grow w-full ">
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
                        </div>
                    </Flex>
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    );
}

function DetailRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <Group wrap="nowrap" align="flex-start">
            <ThemeIcon variant="light" color="gray" size="md">
                {icon}
            </ThemeIcon>
            <Box>
                <Text size="xs" c="dimmed" lh={1.2}>
                    {label}
                </Text>
                <Text size="sm" fw={500}>
                    {value}
                </Text>
            </Box>
        </Group>
    );
}
