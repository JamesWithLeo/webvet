"use client";

import { Button, Group } from "@mantine/core";
import { useState } from "react";

export default function TestCron({ bearer }: { bearer: string }) {
    const [loading, setIsLoading] = useState<boolean>(false);
    const [loadingExpired, setIsLoadingExpired] = useState<boolean>(false);

    const testIncoming = async () => {
        setIsLoading(true);
        const response = await fetch("/api/cron/incoming", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log(result);
        setIsLoading(false);
    };

    const testExpired = async () => {
        setIsLoadingExpired(true);
        const response = await fetch("/api/cron/expired", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        console.log(result);
        setIsLoadingExpired(false);
    };
    return (
        <Group>
            <Button
                variant="default"
                loading={loading}
                onClick={() => {
                    testIncoming();
                }}
            >
                Test incoming
            </Button>
            <Button
                onClick={() => {
                    testExpired();
                }}
                loading={loadingExpired}
                variant="default"
            >
                Test expired
            </Button>
        </Group>
    );
}
