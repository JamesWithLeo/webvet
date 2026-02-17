"use client";

import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";

export default function GoogleButton() {
    return (
        <Button
            variant="default"
            onClick={() => {
                signIn("google", {
                    callbackUrl: "/",
                });
            }}
        >
            Continue with Google
        </Button>
    );
}
