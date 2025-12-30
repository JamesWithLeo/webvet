import { auth } from "@/auth";
import AccountStepperWrapper from "@/components/AccountSetupStepperWrapper";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { Box, Group } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { Baskervville_SC } from "next/font/google";
const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

export default async function SetupAccount() {
    const session = await auth();
    if (!session) redirect("/");
    const { user } = session;
    if (user.firstName && user.lastName && user.dateOfBirth && user.sex) {
        redirect("/");
    }
    return (
        <div className="py-4 px-4 bg-white/35 flex items-center justify-center flex-col gap-8 bg-blend-luminosity min-h-dvh h-full bg-[url(/cover.jpg)] bg-center bg-cover">
            <Box className=" px-8   backdrop-blur-xs  items-center flex backdrop-grayscale-75  bg-white/80 drop-shadow-2xl  shadow-2xl   py-16   gap-16  flex-col max-w-xl w-full  rounded-2xl ">
                <Group>
                    <Logo size="sm" />
                    <h1
                        className={`${baskerville.className} text-[#14678f]  text-4xl`}
                    >
                        Joseph & Mary
                    </h1>
                </Group>
                <AccountStepperWrapper
                    currentStep={0}
                    userId={session.user.id}
                />
            </Box>
            <div className="w-full h-min flex justify-center gap-4 items-center">
                <h1 className="text-white">Wrong Account?</h1>

                <LogoutButton
                    label="Logout"
                    variant="outline"
                    color="red"
                    size="compact-sm"
                    rightSection={<IconLogout size={"20"} />}
                />
            </div>
        </div>
    );
}
