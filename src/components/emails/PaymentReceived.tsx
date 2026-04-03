import LongItemFormatter from "@/lib/LongItemFormatter";
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
    Button,
    Hr,
    Font,
} from "@react-email/components";

export default function PaymentReceived({
    id,
    name,
    pets,
    amount,
    eventDateTime,
}: {
    id: string;
    name: string;
    pets: string[];
    amount: string;
    eventDateTime: string;
}) {
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
            <Preview>
                Receipt for [Pet's Name]'s visit at [Clinic Name] - [Date]
            </Preview>
            <Tailwind>
                <Body className="bg-[#f8fafc] py-12 font-sans">
                    <Container className="mx-auto max-w-[580px] px-6">
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
                                Payment Received
                            </Heading>

                            <Text className="text-slate-600 text-sm leading-7 mt-6">
                                Hi{" "}
                                <span className="font-semibold text-slate-900">
                                    {name}
                                </span>
                                ,
                            </Text>

                            <Text className="text-slate-600 text-sm leading-7">
                                Thank you for trusting us with{" "}
                                <strong>{LongItemFormatter(pets)}</strong> care
                                today! This email serves as your official
                                digital receipt for the services provided on{" "}
                                date.
                            </Text>

                            {/* Detail Box */}
                            {/* <Section className="bg-slate-50 rounded-lg p-4 my-6 border border-slate-100">
                                <Text className="m-0 text-sm text-slate-500 uppercase tracking-tight font-semibold">
                                    Scheduled Date & Time
                                </Text>
                                <Text className="m-0 text-lg     font-medium text-slate-900">
                                    {eventDateTime}
                                </Text>
                            </Section> */}

                            {/* <Text className="text-slate-600 text-sm italic mb-6">
                                Please arrive at least 5 minutes early to allow
                                for check-in.
                            </Text> */}

                            <Section>
                                <Text className="text-slate-900 text-sm leading-7 mt-6">
                                    Date: {eventDateTime}
                                </Text>
                                <Text className="text-slate-900 text-sm leading-7 ">
                                    Amount: {amount}
                                </Text>
                            </Section>

                            <Section className="text-center">
                                {" "}
                                <Button
                                    className="bg-[#47a3d8] text-white font-bold py-3 px-8 rounded-lg text-sm decoration-none inline-block shadow-md"
                                    href={`https://www.josephmary.me/v1/appointments/${id}`}
                                >
                                    Download PDF Receipt
                                </Button>
                            </Section>

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
}
