"use client";

import { Button, Text } from "@mantine/core";
import { useInterval } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IconMail } from "@tabler/icons-react";

const COOLDOWN_SECONDS = 60;

export function ResendOTPButton() {
    const [seconds, setSeconds] = useState(COOLDOWN_SECONDS);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const interval = useInterval(() => {
        setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    useEffect(() => {
        interval.start();
        return interval.stop;
    }, []);

    const handleResend = async () => {
        const email = sessionStorage.getItem("auth_email");

        if (!email) {
            router.push("/");
            return;
        }

        setLoading(true);

        try {
            const result = await signIn("resend", {
                email,
                redirect: false,
            });

            if (result?.ok && !result.error) {
                notifications.show({
                    title: "Code sent",
                    message:
                        "A new verification code has been sent to your email.",
                    color: "teal",
                    icon: <IconMail size={16} />,
                });

                setSeconds(COOLDOWN_SECONDS);
                interval.start();
            } else {
                throw new Error(result?.error || "Failed to resend");
            }
        } catch (error) {
            notifications.show({
                title: "Error",
                message:
                    "Could not resend code. Please try again in a few minutes.",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Button
                mt={"md"}
                variant="light"
                fullWidth
                onClick={handleResend}
                disabled={seconds > 0 || loading}
                loading={loading}
            >
                {seconds > 0 ? `Resend OTP in ${seconds}s` : "Resend OTP"}
            </Button>

            {seconds > 0 && (
                <Text size="xs" c="dimmed" ta="center" mt={5}>
                    Wait for the cooldown to request a new code.
                </Text>
            )}
        </div>
    );
}
