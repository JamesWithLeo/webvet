"use client";

import { signIn } from "next-auth/react";
import { PinInput } from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export default function AuthPin({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");

    const handleVerify = async (otp: string) => {
        setLoading(true);

        const result = await signIn("resend", {
            email,
            token: otp,
            redirect: false,
            callbackUrl: "/v1/dashboard",
        });

        if (result?.error) {
            setLoading(false);
            setValue("");

            notifications.show({
                title: "Verification failed",
                message: "The code you entered is invalid or has expired.",
                color: "red",
            });
        } else if (result?.url) {
            window.location.href = result.url;
        }
    };
    return (
        <PinInput
            value={value}
            onChange={setValue}
            length={6}
            variant="filled"
            type="number"
            placeholder="○"
            oneTimeCode
            disabled={loading}
            size="lg"
            autoFocus
            onComplete={handleVerify}
            error={!!value && value.length === 6 && !loading} // Optional visual error state
        />
    );
}
