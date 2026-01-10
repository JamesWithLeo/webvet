"use client`";

import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
    Img,
} from "@react-email/components";

export const MagicLinkEmail = ({
    baseUrl,
    identifier,
}: {
    baseUrl: string;
    identifier: string;
}) => {
    const params = new URLSearchParams({
        callbackUrl: baseUrl,
        email: identifier,
    });
    return (
        <Html>
            <Head />
            <Preview>Login link for Joseph and Mary Clinic</Preview>
            <Tailwind>
                <Body className="bg-slate-50 font-sans">
                    <Container className="mx-auto py-8 mt-8 px-4 max-w-145">
                        <Img
                            src="https://cap1-webvet.vercel.app/logo.svg"
                            width="75"
                            height="75"
                            alt="Clinic Logo"
                            className="mx-auto "
                        />
                        <Section className="bg-white border border-slate-200 rounded-lg p-8  mt-4 text-center">
                            <Heading className="text-lg font-bold text-slate-800 mt-8">
                                Welcome to the Joseph & Mary <br />
                                Veterinary Clinic
                            </Heading>
                            <Text className="text-slate-600 text-sm leading-6 mt-10">
                                We received a request to log in to your account.
                                <br />
                                If you did not request this email, please ignore
                                it.
                            </Text>

                            <Section className="mt-4 mb-8">
                                <Link
                                    href={`${baseUrl}/v1/auth/verify?${params}`}
                                    className="bg-[#47a3d8] text-white text-sm font-semibold py-3 px-6 rounded-md no-underline"
                                >
                                    Sign In to Dashboard
                                </Link>
                            </Section>
                        </Section>

                        <Text className="text-slate-400 text-xs text-center mt-10">
                            © 2025 Education Purposes Only. This is a
                            non-affiliated academic capstone project for
                            educational use only; it is not an official system
                            of Joseph and Mary Veterinary Clinic.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
