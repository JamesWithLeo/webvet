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
} from "@react-email/components";

interface VerificationCodeEmailProps {
    name: string;
    otp: string;
}

const VerificationCodeEmail = ({ name, otp }: VerificationCodeEmailProps) => {
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
                                    We received a request to log in to your
                                    account. Please enter the following <br />
                                    code into the login screen:
                                </Text>

                                <Text className="text-4xl font-bold bg-slate-100  w-min p-2 rounded-md tracking-[10px] text-slate-900 m-0">
                                    {otp}
                                </Text>

                                <Text className="text-slate-500 text-xs leading-6 italic">
                                    This code is valid for a limited time. If
                                    you did not request this email, please
                                    ignore it.
                                </Text>
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

export default VerificationCodeEmail;
