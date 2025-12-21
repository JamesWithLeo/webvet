import { auth } from "@/auth";
import AccountStepperWrapper from "@/components/AccountStepperWrapper";
import LogoutButton from "@/components/LogoutButton";
import { Box } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { redirect } from "next/navigation";

export default async function SetupAccount() {
    const session = await auth();
    if (!session) redirect("/");
    const { user } = session;
    if (user.firstName && user.lastName && user.dateOfBirth && user.sex) {
        redirect("/");
    }
    return (
        <div className="py-4 px-4 bg-gray-100 min-h-dvh h-full ">
            <div className="w-full h-min flex flex-col items-end">
                <LogoutButton
                    label="Logout"
                    className="col-start-1 "
                    variant="subtle"
                    color="red"
                    size="sm"
                    rightSection={<IconLogout size={"20"} />}
                />
            </div>
            <Box className="bg-white px-8  py-16 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  gap-10 flex flex-col max-w-xl w-full  rounded-2xl shadow">
                <AccountStepperWrapper
                    currentStep={0}
                    userId={session.user.id}
                />
            </Box>
        </div>
    );
}
