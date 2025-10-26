"use client";

import { Box, Modal } from "@mantine/core";
import { useEffect } from "react";

export default function SuccessModal({
    opened,
    timeOut,
    onClose,
    title,
    body,
}: {
    opened: boolean;
    timeOut: 1000 | 2000 | 3000 | 4000 | 5000 | 10000;
    onClose: () => void;
    title: string;
    body: string;
}) {
    useEffect(() => {
        if (opened) {
            setTimeout(() => {
                onClose();
            }, timeOut);
        }
    }, [opened]);
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            size={"lg"}
        >
            <Box className="flex select-none flex-col gap-4 p-4 text-center">
                <h1 className=" text-3xl">{title}</h1>
                <h1>{body}</h1>
            </Box>
        </Modal>
    );
}
