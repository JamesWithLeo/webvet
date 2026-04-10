"use client";

import { signIn } from "next-auth/react";
import { Group, PinInput, Text, Button, Divider, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { checkAuthLimit } from "@/actions/rateLimit";
import { IconAlertCircle, IconMail, IconLock } from "@tabler/icons-react";
import EmailAnimation from "../common/EmailAnimation";
import { useInterval } from "@mantine/hooks";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const COOLDOWN_SECONDS = 60;

export default function AuthPin() {
    const [seconds, setSeconds] = useState(COOLDOWN_SECONDS);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [loadingPin, setLoadingPin] = useState(false);
    const [valuePin, setValuePin] = useState("");
    const [isError, setIsError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
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
        setLoadingPin(true);
        setIsError(false);

        const limit = await checkAuthLimit(email);

        if (!limit.success) {
            setLoadingPin(false);
            setValuePin("");
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
            setLoadingPin(false);
            setValuePin("");
            setIsError(true);

            if (result.code === "RATE_LIMIT_EXCEEDED") {
                notifications.show({
                    title: "Verification failed",
                    message: "Rate limit exceeded, please try again later.",
                    color: "red",
                });
            } else if (result.code === "PIN_EXPIRED") {
                notifications.show({
                    title: "PIN Expired",
                    message:
                        "This code is no longer valid. Please request a new one.",
                    color: "orange",
                    icon: <IconLock size={16} />,
                });
            } else if (result.code === "TOO_MANY_ATTEMPTS") {
                setIsDisabled(true);
                notifications.show({
                    title: "Account Locked",
                    message:
                        "Too many failed guesses. This code has been deactivated for your security. Please request a new one.",
                    color: "red",
                    icon: <IconAlertCircle size={16} />,
                });
            } else if (result.code === "WRONG_PIN") {
                notifications.show({
                    title: "Wrong Pin",
                    message:
                        "The code you entered is incorrect. Please try again.",
                    color: "orange",
                    icon: <IconLock size={16} />,
                });
            } else {
                notifications.show({
                    title: "Invalid PIN",
                    message:
                        "Unexpected error happened, Please try again later.",
                    color: "red",
                    icon: <IconLock size={16} />,
                });
            }
        } else {
            sessionStorage.removeItem("auth_email");
            router.push("/v1/dashboard");
        }
    };

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
                setIsDisabled(false);
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
                notifications.show({
                    title: "Error",
                    message: result.error,
                    color: "red",
                });
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
        <>
            <Text fw={"bold"} mt={"sm"}>
                {email}
            </Text>
            <div className="w-full flex flex-col items-center">
                <div className="w-40   h-auto min-w-40  min-h-40">
                    <EmailAnimation />
                </div>
            </div>
            <Group justify="center">
                <PinInput
                    value={valuePin}
                    onChange={(val) => {
                        setValuePin(val);
                        if (isError) setIsError(false);
                    }}
                    length={6}
                    variant="filled"
                    type="number"
                    placeholder="○"
                    oneTimeCode
                    disabled={loadingPin || isDisabled}
                    size="lg"
                    autoFocus={false}
                    onComplete={handleVerify}
                    error={isError}
                />
            </Group>
            <Text mt={"md"} c={"dimmed"} size="sm">
                Didn't receive the email? Check your spam folder. Still can't
                find it?
            </Text>
            <Stack gap={"sm"}>
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
                    <Text size="xs" c="dimmed" ta="center">
                        Wait for the cooldown to request a new code.
                    </Text>
                )}
                <Divider />
                <Button
                    variant="subtle"
                    color="gray"
                    radius={"md"}
                    onClick={() => {
                        sessionStorage.removeItem("auth_email");
                        router.replace("/v1/auth/signup");
                    }}
                >
                    Try another email
                </Button>
            </Stack>
        </>
    );
}
