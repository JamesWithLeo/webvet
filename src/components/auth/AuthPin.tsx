"use client";

import { signIn } from "next-auth/react";
import { PinInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { checkAuthLimit } from "@/actions/rateLimit";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function AuthPin() {
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("auth_email");
        if (!storedEmail) {
            router.push("/");
            return;
        }

        if (!EMAIL_REGEX.test(storedEmail)) {
            console.error("Invalid email format in session storage");
            sessionStorage.removeItem("auth_email");
            router.push("/");
            return;
        }

        setEmail(storedEmail);
    }, [router]);

    const handleVerify = async (otp: string) => {
        if (!email) return;
        setLoading(true);
        setIsError(false);

        const limit = await checkAuthLimit(email);

        if (!limit.success) {
            setLoading(false);
            notifications.show({
                title: "Too many attempts",
                message: `Please wait ${limit.retryInSeconds}s before trying again.`,
                color: "orange",
            });
            return;
        }

        const result = await signIn("otp-verify", {
            email,
            otp,
            redirect: false,
        });

        if (result?.error) {
            setLoading(false);
            setValue("");
            setIsError(true);

            notifications.show({
                title: "Verification failed",
                message: result.error,
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
            onChange={(val) => {
                setValue(val);
                if (isError) setIsError(false);
            }}
            length={6}
            variant="filled"
            type="number"
            placeholder="○"
            oneTimeCode
            disabled={loading}
            size="lg"
            autoFocus
            onComplete={handleVerify}
            error={isError}
        />
    );
}
