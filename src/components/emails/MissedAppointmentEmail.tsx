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
    Link,
} from "@react-email/components";

export default function MissedAppointmentEmail({
    id,
    name,
    title,
    eventDateTime,
}: {
    id: string;
    name: string;
    title: string;
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
                Missed Appointment: Joseph and Mary Veterinary Clinic
            </Preview>
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
                                Missed Appointment!
                            </Heading>
                            <Text className="text-slate-600 text-sm leading-7 mt-6">
                                Hi{" "}
                                <span className="font-semibold text-slate-900">
                                    {name}
                                </span>
                                ,
                            </Text>
                            <Text className="text-slate-600 text-sm leading-7">
                                We noticed that you missed your appointment
                                today,{" "}
                                <Link
                                    href={`https://josephmary.me/v1/appointments/${id}`}
                                    className="font-bold  text-slate-600 "
                                >
                                    {title}
                                </Link>{" "}
                                at <strong>{eventDateTime}</strong>. If
                                everything is okay, please reach out to us to
                                reschedule, as we want to ensure their health is
                                on track.
                            </Text>

                            <Section className="text-center">
                                <Button
                                    className="bg-[#47a3d8] text-white font-bold py-3 px-8 rounded-lg text-sm decoration-none inline-block shadow-md"
                                    href={`https://www.josephmary.me/v1/appointments/new`}
                                >
                                    Add new appointment
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
