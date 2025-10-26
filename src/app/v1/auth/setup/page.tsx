import { authOptions } from "@/authOptions";
import AccountStepper from "@/components/AccountStepper";
import AccountStepperWrapper from "@/components/AccountStepperWrapper";
import { Box } from "@mantine/core";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function SetupAccount() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    const { user } = session;
    if (user.firstName && user.lastName && user.dateOfBirth && user.sex) {
        redirect("/");
    }
    return (
        <div className="py-8 px-32 bg-gray-100 min-h-screen items-center flex-col flex justify-center">
            <Box className="bg-white px-8 h-full py-16  gap-10 flex flex-col max-w-xl w-full  rounded-2xl shadow">
                <AccountStepperWrapper
                    currentStep={0}
                    userId={session.user.id}
                />
            </Box>
        </div>
    );
}
