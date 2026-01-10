import BottomPattern from "@/components/BottomPattern";
import LogoWithText from "@/components/LogoWithText";
import VerifyAccountButton from "@/components/VerifyAccountButton";
import { Text, Title, Stack, Container, Center } from "@mantine/core";
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const email = typeof params.email === "string" ? params.email : "";
    const token = typeof params.token === "string" ? params.token : "";
    const providerName =
        typeof params.providerName === "string" ? params.providerName : "";

    return (
        <div className="w-full min-h-dvh items-center flex flex-col justify-center">
            <div
                className="fixed -z-10 inset-0 "
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
       repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
          radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
      `,
                    WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
          radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)
      `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />
            <div className="flex flex-col items-center gap-23">
                <LogoWithText />
                <Stack align="center" gap="xl">
                    <Stack align="center" gap="xs">
                        <Title order={3} fw={900} ta="center">
                            Verify your account to login
                        </Title>

                        <Text c="dimmed" fz="md" ta="center" maw={400}>
                            To finish setting up your account and get started,
                            please confirm the email address associated with
                            your
                            {providerName ? ` ${providerName}` : ""} profile.
                        </Text>
                    </Stack>

                    <Stack align="center" gap={5}>
                        <Text size="sm" fw={500} c="dimmed">
                            {" "}
                            Login as:{" "}
                        </Text>
                        <Text fw={600} size="lg">
                            {email}
                        </Text>
                    </Stack>

                    <Stack gap={"xs"}>
                        <VerifyAccountButton
                            email={email}
                            token={token}
                            providerName={providerName}
                        />
                        <Text size="xs" c="dimmed" ta="center">
                            If you didn’t request this email, you can safely
                            ignore it.
                        </Text>
                    </Stack>
                </Stack>
                <Link href={"/v1"}>
                    <Text size="xs" c="dimmed" ta="center">
                        Go back to Home page
                    </Text>
                </Link>
            </div>
        </div>
    );
}
