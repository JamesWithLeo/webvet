"use client";

import { Button, MantineBreakpoint } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

export default function NewAppointmentButton({
    size,
}: {
    size: MantineBreakpoint;
}) {
    const router = useRouter();

    return (
        <Button
            size={size}
            variant="default"
            onClick={() => {
                router.push("/v1/appointments/new");
            }}
            leftSection={<IconPlus size={20} stroke={1.5} />}
        >
            New Appointment
        </Button>
    );
}
