"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

export default function NewAppointmentButton() {
    const router = useRouter();

    return (
        <Button
            variant="default"
            onClick={() => {
                router.push("/v1/appointments/new");
            }}
            leftSection={<IconPlus size={20} />}
        >
            New Appointment
        </Button>
    );
}
