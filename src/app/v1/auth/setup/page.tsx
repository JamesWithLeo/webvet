import AccountStepperWrapper from "@/components/user/AccountSetupStepperWrapper";
import Logo from "@/components/common/Logo";
import { Box, Group } from "@mantine/core";
import { Baskervville_SC } from "next/font/google";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

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
    if (
        user.firstName &&
        user.lastName &&
        user.dateOfBirth &&
        user.gender &&
        user.contactNumber &&
        !session.error
    ) {
        redirect("/");
    }
    return (
        <div className="py-4 px-4 flex items-center justify-center flex-col gap-8 bg-blend-luminosity min-h-dvh h-full  bg-center bg-cover">
            <Box className=" px-8  z-10 relative  backdrop-blur-xs bg-white items-center flex backdrop-grayscale-75   drop-shadow-2xl  shadow-2xl   py-16   gap-16  flex-col max-w-xl w-full  rounded-2xl ">
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
            <div className="absolute inset-0 -z-10">
                <Image
                    src={"https://www.josephmary.me/cover.jpg"}
                    alt=""
                    fill
                    priority
                    quality={75}
                    className="object-cover bg-blend-luminosity opacity-80" // Adjusted opacity for readability
                    sizes="(max-width: 768px) 100vw, 1920px"
                />
                <div className="absolute inset-0 bg-white/20" />
            </div>
        </div>
    );
}
