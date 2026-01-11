"use client";

import { signOut } from "next-auth/react";
import { Button, ButtonProps } from "@mantine/core";

type LogoutButtonProps = ButtonProps & { label: string };

export default function LogoutButton({ label, ...props }: LogoutButtonProps) {
    return (
        <Button
            {...props}
            onClick={() => {
                signOut({ callbackUrl: "/" });
            }}
        >
            {label}
        </Button>
    );
}
