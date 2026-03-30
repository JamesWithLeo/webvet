"use client";
import AppointmentSaved from "@/components/emails/AppointmentSaved";
import MagicLinkEmail from "@/components/emails/MagicLinkEmail";
import PaymentReceived from "@/components/emails/PaymentReceived";
import { Button, PinInput } from "@mantine/core";

export default function Page() {
    const testIncoming = async () => {
        const response = await fetch("/api/cron/incoming");
        console.log(await response.json());
    };

    return (
        <>
            <PinInput
                length={6}
                type="number"
                placeholder="○" // Optional: custom placeholder
                oneTimeCode
                size="md" // Makes it easier to tap on mobile
                // onComplete={}
            />
            <AppointmentSaved
                id="123456"
                pets="Dash, Foxley, and Ara"
                name={"James"}
                type="Deworming"
            />

            <MagicLinkEmail
                // baseUrl="1234"
                // identifier="james123@gmail.com"
                // token="12345"
                name={"james123@gmail.com".split("@")[0]}
                otp="123456"
                // providerName="Google"
            />

            <PaymentReceived name={"James"} />

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
