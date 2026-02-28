"use client";

import { Button } from "@mantine/core";
import { IconCornerLeftUp } from "@tabler/icons-react";
import Link from "next/link";

export default function BackToAppointment() {
    return (
        <Button
            variant="transparent"
            c={"gray"}
            size="xs"
            leftSection={<IconCornerLeftUp size={18} />}
            component={Link}
            href={"/v1/appointments"}
        >
            Back to appointments{" "}
        </Button>
    );
}
