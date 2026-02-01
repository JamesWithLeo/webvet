"use client";
import AppointmentSaved from "@/components/emails/AppointmentSaved";
import MagicLinkEmail from "@/components/emails/MagicLinkEmail";
import { Button } from "@mantine/core";

export default function Page() {
    const testIncoming = async () => {
        const response = await fetch("/api/cron/incoming");
        console.log(await response.json());
    };

    return (
        <>
            <AppointmentSaved
                id="123456"
                pets="Dash, Foxley, and Ara"
                name={"James"}
                type="Deworming"
            />

            <MagicLinkEmail
                baseUrl="1234"
                identifier="james123@gmail.com"
                token="12345"
                name={"james123@gmail.com".split("@")[0]}
                providerName="Google"
            />

            <Button
                onClick={() => {
                    testIncoming();
                }}
            >
                Test incoming
            </Button>
        </>
    );
}
