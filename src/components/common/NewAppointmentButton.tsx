"use client";

import { Button, MantineBreakpoint } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconCalendarPlus } from "@tabler/icons-react";

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
            radius={"md"}
            onClick={() => {
                router.push("/v1/appointments/new");
            }}
            leftSection={<IconCalendarPlus size={20} stroke={1.5} />}
        >
            Add appointment
        </Button>
    );
}
