import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Img,
    Hr,
    Font,
} from "@react-email/components";

interface VerificationCodeEmailProps {
    name: string;
    otp: string;
}

const VerificationCodeEmail = ({ name, otp }: VerificationCodeEmailProps) => {
    return (
        <Html>
            <Head>
                <Font
                    fontFamily="Baskervville SC"
                    fallbackFontFamily="sans-serif"
                    webFont={{
                        url: "https://fonts.gstatic.com/s/baskervvillesc/v1/rax_HiS69-Xn_U3AAnWp8P_538v_Y-4.woff2",
                        format: "woff2",
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>OTP : Joseph and Mary Veterinary Clinic</Preview>
            <Tailwind>
                <Body className="bg-[#f8fafc] py-12 font-sans">
                    <Container className="mx-auto max-w-145 px-6">
                        {/* Logo Section */}
                        <Section className="text-center mb-8">
                            <Img
                                src="https://www.josephmary.me/logo.png"
                                width="40"
                                height="40"
                                alt="Clinic Logo"
                                className="mx-auto"
                            />
                            <Text
                                style={{
                                    fontFamily: "'Baskervville SC', serif",
                                }}
                                className={`mt-2 text-lg text-[#14678f] `}
                            >
                                Joseph & Mary Veterinary Clinic
                            </Text>
                        </Section>

                        {/* Main Content Card */}
                        <Section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                            <Heading className="text-lg font-normal text-[#1e293b] m-0 ">
                                Login request
                            </Heading>

                            <Text className="text-slate-600 text-sm leading-7 mt-6">
                                Welcome{" "}
                                <span className="font-semibold text-slate-900">
                                    {name}
                                </span>
                                ,
                            </Text>

                            <Text className="text-slate-600 text-sm leading-7">
                                We received a request to log in to your account.
                                Please enter the following code into the login
                                screen:
                            </Text>

                            <Section
                                style={{
                                    backgroundColor: "#f8fafc", // slate-50
                                    borderRadius: "8px",
                                    border: "1px solid #f1f5f9", // slate-100
                                    marginTop: "24px",
                                    marginBottom: "24px",
                                    width: "100%",
                                }}
                            >
                                <Text className="text-center  text-lg tracking-widest w-full">
                                    {otp}
                                </Text>
                            </Section>

                            <Text className="text-slate-600 text-sm italic mb-6">
                                This code is valid for a limited time. If you
                                did not request this email, please ignore it.
                            </Text>

                            <Hr className="border-slate-200 mt-8 mb-4" />

                            <Text className="text-slate-400 text-xs leading-5">
                                Questions? Reply to this email or visit our
                                website dashboard for assistance.
                            </Text>
                        </Section>

                        {/* Footer Disclaimer */}
                        <Section className="mt-8">
                            <Text className="text-slate-400  font-sans text-xs text-center   px-4">
                                © 2026 Education Purposes Only. This is a
                                non-affiliated academic capstone project for
                                educational use only; it is not an official
                                system of Joseph and Mary Veterinary Clinic.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default VerificationCodeEmail;
