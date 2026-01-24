"use client";

import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";

export default function ConfirmationModal({
    opened,
    close,
    title,
    message,
    isPending,
    onConfirm,
}: {
    opened: boolean;
    close: () => void;
    isPending: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
}) {
    return (
        <Modal withCloseButton={false} opened={opened} onClose={close}>
            <Stack gap={"xl"}>
                <div className="flex flex-col gap-1">
                    <Title order={3}>{title}</Title>
                    <Text>{message}</Text>
                </div>
                <Group justify="end">
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        loading={isPending}
                    >
                        Confirm
                    </Button>
                    <Button variant="default" onClick={close}>
                        Cancel
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
