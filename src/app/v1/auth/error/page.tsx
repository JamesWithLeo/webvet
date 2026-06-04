import BottomPattern from "@/components/common/BottomPattern";
import EmailAnimation from "@/components/common/EmailAnimation";
import LogoWithText from "@/components/common/LogoWithText";
import { Button, Card, Group, Text } from "@mantine/core";

export default function Page() {
    return (
        <div className="flex bg-gray-50 min-h-dvh justify-center gap-8 flex-col items-center p-8  lg:p-16">
            <BottomPattern />
            <Group>
                <LogoWithText />
            </Group>
            <Card withBorder>
                <div className="py-12 px-8 flex  flex-col ">
                    <h1 className="font-bold text-xl">Unable to sign in</h1>
                    <Text>The sign in link is no longer valid.</Text>
                    <Text>
                        It may have been used already or it may have expired.
                    </Text>
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
                        Sign in
                    </Button>
                </div>
            </Card>
        </div>
    );
}
