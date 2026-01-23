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

const MagicLinkEmail = ({
    baseUrl,
    name,
    identifier,
    token,
    providerName,
}: {
    name: string;
    baseUrl: string;
    identifier: string;
    token: string;
    providerName: string;
}) => {
    const params = new URLSearchParams({
        callbackUrl: baseUrl,
        email: identifier,
        token: token,
        providerName: providerName,
    });
    return (
        <Html>
            <Head />
            <Preview>Login link for Joseph and Mary Veterinary Clinic</Preview>
            <Tailwind>
                <Body className="bg-slate-50 font-sans">
                    <Container className="mx-auto py-8 mt-8 px-4 max-w-145">
                        <Img
                            src="https://www.josephmary.me/logo.png"
                            width="50"
                            height="50"
                            alt="Clinic Logo"
                            className="mx-auto "
                            style={{
                                colorScheme: "light",
                            }}
                        />
                        <Section className="bg-white border border-slate-200 rounded-lg   mt-4  ">
                            <Section className="ml-8">
                                <Heading className="text-xl  text-slate-800 mt-8">
                                    Login to the{" "}
                                    <strong>
                                        Joseph & Mary Veterinary Clinic
                                    </strong>
                                </Heading>
                                <Text className="text-slate-600 text-sm leading-6 mt-6">
                                    Welcome {name},
                                </Text>
                                <Text className="text-slate-600 text-sm leading-6 mt-4">
                                    We received a request to log in to your{" "}
                                    account, Please click the link to <br />{" "}
                                    continue. If you did not request this email,
                                    please ignore it.
                                </Text>

                                <Link
                                    href={`${baseUrl}/v1/auth/verify?${params}`}
                                    style={{ display: "inline-block" }} // Force the clickable area to match the visual box
                                    className=" text-sm underline mb-8 "
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

export default MagicLinkEmail;
