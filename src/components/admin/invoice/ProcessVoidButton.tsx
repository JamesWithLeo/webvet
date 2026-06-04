"use client";

import {
    MarkAsPaidInvoiceAdmin,
    MarkAsVoidInvoiceAdmin,
} from "@/actions/invoice";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export default function ProcessVoidButton({
    invoiceId,
}: {
    invoiceId: string;
}) {
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure();

    const markAsPaid = MarkAsVoidInvoiceAdmin.bind(null);
    const [formState, formAction, isPending] = useActionState(markAsPaid, {
        success: false,
        id: null,
        error: "",
        status: null,
    });

    const handleVoid = () => {
        startTransition(() => {
            formAction(invoiceId);
        });
    };
    useEffect(() => {
        if (formState.success && formState.id && formState.status) {
            close();

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
                title: "Invoice status failed to update.",
                message: `${formState.error}`,
                color: "red",
                autoClose: false,
                icon: <IconX size={18} />,
            });
        }
    }, [formState]);
    return (
        <>
            <Button radius={"md"} color="dark" onClick={open}>
                Void
            </Button>
            <Modal
                centered
                withCloseButton={false}
                opened={opened}
                onClose={close}
                title="Void invoice"
                radius={"lg"}
            >
                <Stack gap="md">
                    <Text size="sm">
                        This will cancel the current invoice record. You{" "}
                        <strong>cannot undo</strong> this action.
                    </Text>

                    <Group grow>
                        <Button
                            color="dark"
                            onClick={() => handleVoid()}
                            loading={isPending}
                            disabled={isPending || formState.success}
                        >
                            Void
                        </Button>

                        <Button color="dark" variant="outline" onClick={close}>
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
