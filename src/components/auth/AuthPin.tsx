"use client";

import { signIn } from "next-auth/react";
import { PinInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function AuthPin() {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("auth_email");
        if (!storedEmail) {
            router.push("/"); // Redirect back if no email is found
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const handleVerify = async (otp: string) => {
        if (!email) return;
        setLoading(true);

        const result = await signIn("otp-verify", {
            email,
            otp,
            redirect: false,
        });

        if (result?.error) {
            setLoading(false);
            setValue("");
            notifications.show({
                title: "Verification failed",
                message: "Invalid code.",
                color: "red",
            });
        } else {
            sessionStorage.removeItem("auth_email");
            router.push("/v1/dashboard");
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
