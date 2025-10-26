"use client";
import { SessionProvider } from "next-auth/react";
import AccountStepper from "./AccountStepper";
AccountStepper;

export default function AccountStepperWrapper({
    currentStep,
    userId,
}: {
    currentStep: number;
    userId: string;
}) {
    return (
        <SessionProvider>
            <AccountStepper currentStep={currentStep} userId={userId} />
        </SessionProvider>
    );
}
