"use client";

import { SessionProvider } from "next-auth/react";
import AccountStepper from "./AccountSetupStepper";

export default function AccountStepperWrapper({
    currentStep,
}: {
    currentStep: number;
}) {
    return (
        <SessionProvider>
            <AccountStepper currentStep={currentStep} />
        </SessionProvider>
    );
}
