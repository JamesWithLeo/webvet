"use client";

import { Button } from "@mantine/core";
import { useState } from "react";

export default function TestIncoming() {
    const [loading, setIsLoading] = useState<boolean>(false);
    const testIncoming = async () => {
        setIsLoading(true);
        const response = await fetch("/api/cron/incoming");
        console.log(await response.json());
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
