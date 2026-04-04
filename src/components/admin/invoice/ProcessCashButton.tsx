"use client";

import { MarkAsPaidInvoiceAdmin } from "@/actions/invoice";
import { toTitleCase } from "@/lib/toTitleCase";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export default function ProcessCashButton({
    invoiceId,
    firstName,
    email,
    total,
    pets,
}: {
    invoiceId: string;
    firstName: string;
    email: string | null;
    total: number;
    pets: string[];
}) {
    const queryClient = useQueryClient();
    const [
        openedUpdatePayment,
        { open: openUpdatePayment, close: closeUpdatePayment },
    ] = useDisclosure();

    const markAsPaid = MarkAsPaidInvoiceAdmin.bind(null);
    const [formState, formAction, isMarkingAsPaid] = useActionState(
        markAsPaid,
        { success: false, id: null, error: "", status: null }
    );

    const handleMarkAsPaid = () => {
        if (!email) return;

        startTransition(() => {
            formAction({
                id: invoiceId,
                email: email,
                firstName: firstName,
                total: total,
                pets: pets,
                paidAt: new Date(),
            });
        });
    };
    useEffect(() => {
        if (formState.success && formState.id && formState.status) {
            closeUpdatePayment();

            queryClient.invalidateQueries({ queryKey: ["invoices", "admin"] });
            queryClient.invalidateQueries({
                queryKey: ["appointments", "admin", "all"],
            });
            notifications.show({
                title: "Invoice payment status updated",
                message: `Invoice Id: ${formState.id} is now ${formState.status?.toLowerCase()}.`,
                color: "teal",
                autoClose: 6000,
                icon: <IconCheck size={18} />,
            });
        }

        if (formState.error) {
            notifications.show({
                title: "Invoice payment status update failed",
                message: `${formState.error}`,
                color: "red",
                autoClose: false,
                icon: <IconX size={18} />,
            });
        }
    }, [formState]);
    return (
        <>
            <Button radius={"md"} onClick={openUpdatePayment}>
                Process cash payment
            </Button>
            <Modal
                centered
                withCloseButton={false}
                opened={openedUpdatePayment}
                onClose={closeUpdatePayment}
                title="Settled Payment"
                radius={"lg"}
            >
                <Stack gap="md">
                    <Text size="sm">
                        Process payment this transaction. This will update the
                        invoice balance accordingly.
                    </Text>

                    <Group grow>
                        <Button
                            color="red"
                            onClick={() => handleMarkAsPaid()}
                            loading={isMarkingAsPaid}
                            disabled={isMarkingAsPaid || formState.success}
                        >
                            Mark as Paid
                        </Button>

                        <Button
                            color="red"
                            variant="outline"
                            onClick={closeUpdatePayment}
                        >
                            Cancel Payment
                        </Button>
                    </Group>

                    {/* <Divider
                        label="Additional Actions"
                        labelPosition="center"
                    />

                    <Button
                        variant="subtle"
                        color="gray"
                        // onClick={() => handleAdjustAmount(paymentId)}
                    >
                        Edit Amount
                    </Button> */}
                </Stack>
            </Modal>
        </>
    );
}
