"use client";

import {
    Button,
    Modal,
    Text,
    Textarea,
    Checkbox,
    Stack,
    Group,
    NumberInput,
    SegmentedControl,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconReceiptRefund, IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
    refundSchema,
    type RefundSchemaType,
} from "@/lib/validators/refundZodSchema";
import { processRefundAction } from "@/actions/invoice";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useActionState, useEffect } from "react";

export default function IssueRefundButton({
    invoiceId,
    amount,
}: {
    invoiceId: string;
    amount: number;
}) {
    const [opened, { open, close }] = useDisclosure(false);

    const [state, formAction, isPending] = useActionState(processRefundAction, {
        success: false,
        message: "",
    });

    const form = useForm<RefundSchemaType>({
        mode: "controlled",
        initialValues: {
            invoiceId,
            originalTotal: amount,
            refundAmount: amount,
            reason: "",
            refundMethod: "CASH",
        },
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: zod4Resolver(refundSchema),
    });

    useEffect(() => {
        if (state.success) {
            notifications.show({
                title: "Refund Processed",
                message: state.message,
                color: "green",
            });
            form.reset();
            close();
        } else if (state.message) {
            notifications.show({
                title: "Error",
                message: state.message,
                color: "red",
            });
        }
    }, [state, close, form]);

    return (
        <>
            <Button
                variant="light" // Original Style
                color="red"
                leftSection={<IconReceiptRefund size={16} />}
                radius="md" // Original Style
                onClick={open}
            >
                Issue Refund
            </Button>

            <Modal
                opened={opened}
                onClose={close}
                title="Process Financial Refund"
                centered
                radius="lg" // Original Style
                p={"xl"} // Original Style
            >
                <form
                    action={() => {
                        formAction(form.values);
                    }}
                >
                    <Stack>
                        <Text size="sm" c="dimmed">
                            You are issuing a refund for Invoice{" "}
                            <Text span fw={700} c="black">
                                #{invoiceId}
                            </Text>
                            . This action is irreversible and will be logged.
                        </Text>

                        <SegmentedControl
                            {...form.getInputProps("refundMethod")}
                            data={[
                                { label: "Cash / In-Person", value: "CASH" },
                                { label: "Xendit Gateway", value: "DIGITAL" },
                            ]}
                        />

                        <NumberInput
                            label="Amount to Refund"
                            description={`Maximum refundable: ₱${amount.toLocaleString()}`}
                            prefix="₱"
                            decimalScale={2}
                            max={amount}
                            fixedDecimalScale
                            {...form.getInputProps("refundAmount")}
                        />

                        <Textarea
                            label="Reason for Refund"
                            placeholder="e.g., Client requested cancellation..."
                            minRows={3}
                            {...form.getInputProps("reason")}
                        />

                        {/* {form.values.refundMethod === "DIGITAL" && (
                            <Checkbox
                                label="I have initiated this in Xendit"
                                color="red"
                                {...form.getInputProps("confirmedInGateway", {
                                    type: "checkbox",
                                })}
                            />
                        )} */}

                        <Group justify="flex-end" mt="md">
                            <Button
                                variant="subtle"
                                color="gray"
                                onClick={close}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                color="red"
                                loading={isPending}
                                disabled={!form.isValid()}
                                leftSection={<IconAlertCircle size={16} />}
                            >
                                Confirm Refund
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}
