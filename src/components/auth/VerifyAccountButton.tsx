"use client";

import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

interface Props {
    email: string;
    token: string;
    providerName: string;
}

export default function VerifyAccountButton({
    email,
    token,
    providerName,
}: Props) {
    const handleManualVerify = ({
        token,
        email,
    }: {
        token: string;
        email: string;
    }) => {
        const baseUrl = "/v1/auth/setup";
        if (!token || !email) {
            notifications.show({
                title: "Error verification",
                message: "Missing or insufficient required data",
                color: "red",
                withBorder: true,
                icon: <IconX size={20} />,
                autoClose: 4000,
            });
            return;
        }

        const params = new URLSearchParams({
            callbackUrl: baseUrl,
            token: token,
            email: email,
        });

        const finalUrl = `/api/auth/callback/${providerName.toLowerCase()}?${params.toString()}`;

        window.location.href = finalUrl;
    };
    return (
        <Button
            size="sm"
            onClick={async () => {
                handleManualVerify({ token, email });
            }}
        >
            Verify
        </Button>
    );
}
