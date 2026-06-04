// components/PaymentButton.tsx
"use client";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";

export function ProcessPaymentButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" loading={pending} variant="gradient">
            {pending ? "Connecting to provider..." : "Process Payment"}
        </Button>
    );
}
