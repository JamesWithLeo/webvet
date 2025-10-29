"use client";

import { signOut } from "next-auth/react";
import { Button, ButtonProps } from "@mantine/core";

type LogoutButtonProps = ButtonProps & {};

export default function LogoutButton({ ...props }: LogoutButtonProps) {
    return (
        <Button
            {...props}
            onClick={() => {
                signOut({ callbackUrl: "/" });
            }}
        >
            Logout
        </Button>
    );
}
