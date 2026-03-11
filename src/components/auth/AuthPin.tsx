"use client";

import { signIn } from "next-auth/react";
import { PinInput, Stack, Text, Loader } from "@mantine/core";
import { useState } from "react";

export default function AuthPin({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const handleVerify = async (otp: string) => {
        setLoading(true);

        await signIn("resend", {
            email,
            token: otp,
            redirect: true,
            callbackUrl: "/v1/dashboard",
        });
    };
    return (
        <PinInput
            length={6}
            variant="filled"
            type="number"
            placeholder="○" // Optional: custom placeholder
            oneTimeCode
            disabled={loading}
            size="lg" // Makes it easier to tap on mobile
            autoFocus
            onComplete={handleVerify}
        />
    );
}
