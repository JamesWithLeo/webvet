"use client";

import { signIn } from "next-auth/react";
import { Button, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ label }: { label: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        const result = await signIn("resend", {
            email,
            redirect: false,
        });

        if (result?.ok) {
            router.push(
                `/v1/auth/verify-request?email=${encodeURIComponent(email)}`
            );
        } else {
            setLoading(false);
        }
    };

    return (
        <form className="gap-3.5 flex flex-col" onSubmit={handleSubmit}>
            <TextInput
                label="Email"
                name="email"
                type="email"
                required
                disabled={loading}
            />
            <Button type="submit" w={"100%"} loading={loading}>
                {label}
            </Button>
        </form>
    );
}
