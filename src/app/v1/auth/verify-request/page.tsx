import { Button, Group, Text } from "@mantine/core";
import EmailAnimation from "@/components/common/EmailAnimation";
import LogoWithText from "@/components/common/LogoWithText";
import CenterPattern from "@/components/common/CenterPattern";

export default function Page() {
    return (
        <div className="flex justify-center  min-h-dvh gap-8 flex-col items-center  lg:p-16 p-8">
            <CenterPattern />
            <Group>
                <LogoWithText />
            </Group>
            <div className="py-12 px-8 flex  flex-col ">
                <h1 className="font-bold text-xl">Please verify your email</h1>
                <Text>We send an email to the address you provided</Text>
                <div className="w-full flex flex-col items-center">
                    <div className="w-40   h-auto min-w-40  min-h-40">
                        <EmailAnimation />
                    </div>
                </div>
                <Text mt={"md"} c={"dimmed"} size="sm">
                    Didn't receive the email? Check your spam folder. Still
                    can't find it?
                </Text>
                <Button mt={"md"} variant="light">
                    Resend verification
                </Button>
            </div>
        </div>
    );
}
