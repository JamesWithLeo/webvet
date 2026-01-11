"use client";

import { SessionProvider } from "next-auth/react";
import AccountStepper from "./AccountSetupStepper";

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
