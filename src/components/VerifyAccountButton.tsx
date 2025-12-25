"use client";

import { Button } from "@mantine/core";

interface Props {
    email: string;
    token: string;
}

export default function VerifyAccountButton({ email, token }: Props) {
    const handleManualVerify = ({
        token,
        email,
    }: {
        token: string;
        email: string;
    }) => {
        const baseUrl = "/v1/auth/setup";
        if (!token || !email) {
            alert("Missing verification data.");
            return;
        }

        const params = new URLSearchParams({
            callbackUrl: baseUrl,
            token: token,
            email: email,
        });

        const finalUrl = `/api/auth/callback/nodemailer?${params.toString()}`;

        window.location.href = finalUrl;
    };
    return (
        <Button
            onClick={async () => {
                handleManualVerify({ token, email });
            }}
        >
            verify
        </Button>
    );
}
