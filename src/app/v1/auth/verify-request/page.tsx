import { Group, Text } from "@mantine/core";
import LogoWithText from "@/components/common/LogoWithText";
import CenterPattern from "@/components/common/CenterPattern";
import AuthPin from "@/components/auth/AuthPin";
import { ResendOTPButton } from "@/components/auth/ResendOTPButton";

export default async function Page() {
    return (
        <div className="flex justify-center   min-h-dvh gap-8 flex-col items-center  lg:p-16 p-8">
            <CenterPattern />
            <Group>
                <LogoWithText />
            </Group>
            <div className=" flex  flex-col ">
                <h1 className="font-bold text-xl">Please verify your email</h1>
                <Text>We send an OTP to the email address you provided.</Text>
                <AuthPin />
                <Text mt={"md"} c={"dimmed"} size="sm">
                    Didn't receive the email? Check your spam folder. Still
                    can't find it?
                </Text>
                <ResendOTPButton />
            </div>
        </div>
    );
}
