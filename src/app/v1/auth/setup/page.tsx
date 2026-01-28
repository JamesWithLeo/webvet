import { auth } from "@/auth";
import AccountStepperWrapper from "@/components/user/AccountSetupStepperWrapper";
import Logo from "@/components/common/Logo";
import LogoutButton from "@/components/common/LogoutButton";
import { Box, Group } from "@mantine/core";
import { redirect } from "next/navigation";
import { Baskervville_SC } from "next/font/google";

const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

export default async function Page() {
    const session = await auth();
    if (!session) redirect("/");
    const { user } = session;
    if (user.firstName && user.lastName && user.dateOfBirth && user.gender) {
        redirect("/");
    }
    return (
        <div className="py-4 px-4 bg-white/35 flex items-center justify-center flex-col gap-8 bg-blend-luminosity min-h-dvh h-full bg-[url(/cover.jpg)] bg-center bg-cover">
            <Box className=" px-8   backdrop-blur-xs  items-center flex backdrop-grayscale-75  bg-white drop-shadow-2xl  shadow-2xl   py-16   gap-16  flex-col max-w-xl w-full  rounded-2xl ">
                <Group>
                    <Logo size="sm" />
                    <h1
                        className={`${baskerville.className} text-[#14678f]  text-4xl`}
                    >
                        Joseph & Mary
                    </h1>
                </Group>
                <AccountStepperWrapper currentStep={0} />
            </Box>
            <div className="w-full h-min flex justify-center gap-1 items-center">
                <h1 className="text-white">Wrong Account?</h1>

                <LogoutButton
                    label="Log out"
                    variant="transparent"
                    color="red"
                    size="compact-sm"
                />
            </div>
        </div>
    );
}
