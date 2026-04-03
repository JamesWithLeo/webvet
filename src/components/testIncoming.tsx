"use client";

import { Button } from "@mantine/core";
import { useState } from "react";

export default function TestIncoming({ bearer }: { bearer: string }) {
    const [loading, setIsLoading] = useState<boolean>(false);
    const testIncoming = async () => {
        setIsLoading(true);
        const response = await fetch("/api/cron/incoming", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${bearer}`,
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log(result);
        setIsLoading(false);
    };
    return (
        <Button
            variant="default"
            loading={loading}
            onClick={() => {
                testIncoming();
            }}
        >
            Test incoming
        </Button>
    );
}
