"use client";

import {
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    Group,
    Menu,
    MenuItem,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import {
    IconCalendar,
    IconCat,
    IconClock,
    IconDotsVertical,
    IconInvoice,
    IconLogs,
    IconPaw,
    IconPlus,
    IconTag,
} from "@tabler/icons-react";
import { toTitleCase } from "@/lib/toTitleCase";
import { useMediaQuery } from "@mantine/hooks";
import { AppointmentPetMergeType } from "@/db/schema/appointments";
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
        breed,
        photoUrl,
        petId,
        event_datetime,
    },
}: Props) {
    const isMobile = useMediaQuery("(max-width: 64rem)");
    return (
        <Drawer
            position={isMobile ? "bottom" : "right"}
            opened={opened}
            withCloseButton={false}
            closeOnClickOutside={true}
            closeOnEscape={true}
            onClose={close}
            padding="xl"
        >
            <div className="flex flex-col min-h-full h-full gap-4">
                <div className="flex gap-4 h-full items-center">
                    <Avatar src={photoUrl} size={80} radius="md" color="blue">
                        {name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Text size="xl" fw={700}>
                            {toTitleCase(name)}
                        </Text>
                        <Text size="xs" c={"dimmed"}>
                            {petId}
                        </Text>
                        <Badge
                            color="blue"
                            variant="light"
                            leftSection={<IconPaw size={12} />}
                        >
                            Breed: {breed}
                        </Badge>
                    </Box>

                    <div className="flex-1 flex justify-end ">
                        <Menu shadow="md" withArrow width={"250"}>
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
                        </Menu>
                    </div>
                </div>

                <Divider />

                <Stack gap="lg">
                    <DetailRow
                        icon={<IconTag size={18} />}
                        label="Purpose / Title"
                        value={title || "No title provided"}
                    />
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

                <Group>
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
                        disabled={new Date(event_datetime) < new Date()}
                    >
                        Cancel Appointment
                    </Button>
                </Group>
            </div>
        </Drawer>
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
