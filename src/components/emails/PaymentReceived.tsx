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
import { Baskervville_SC } from "next/font/google";
const baskerville = Baskervville_SC({
    subsets: ["latin"],
    display: "swap",
    style: ["normal"],
    weight: ["500"],
});

export default function PaymentReceived({ name }: { name: string | null }) {
    return (
        <Html>
            <Head />
            <Preview>
                Receipt for [Pet's Name]'s visit at [Clinic Name] - [Date]
            </Preview>
            <Tailwind>
                <Body className="bg-slate-50 font-sans">
                    <Container className="mx-auto text-center py-8 mt-8 px-4 max-w-145">
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
                        <Section className="bg-white border text-left border-slate-200 rounded-lg p-4  mt-4  ">
                            <Heading className="text-xl  text-slate-800 mt-4 ml-8">
                                Payment Received
                            </Heading>
                            <Text className="text-slate-600 text-sm leading-6 mt-6 ml-8">
                                Hi {name},
                            </Text>
                            <Text className="text-slate-600 text-sm leading-6 mt-4 ml-8 mr-8">
                                Thank you for trusting us with petname's care
                                today! This email serves as your official
                                digital receipt for the services provided on{" "}
                                date
                            </Text>

                            <Section className="mt-4 mb-4">
                                <Link
                                    href={`https://www.josephmary.me/v1/`}
                                    className=" ml-8 text-sm underline "
                                >
                                    Download PDF Receipt
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
}
