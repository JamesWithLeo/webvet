"use client";

import { createPaymentInvoice } from "@/actions/payment";
import { Button } from "@mantine/core";
import { startTransition, useActionState } from "react";

export default function ProcessPayment({ invoiceId }: { invoiceId: string }) {
    const payAction = createPaymentInvoice.bind(null);
    const [formstate, formAction, isPending] = useActionState(payAction, {
        success: false,
    });
    const handleProcess = () => {
        startTransition(() => {
            formAction(invoiceId);
        });
    };
    return (
        <Button loading={isPending} onClick={handleProcess}>
            Process Payment
        </Button>
    );
}
