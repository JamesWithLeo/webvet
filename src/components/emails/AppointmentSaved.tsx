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

export default function AppointmentSaved({
    id,
    name,
    pets,
    type,
}: {
    id: string;
    name: string | null;
    pets: string;
    type: string;
}) {
    return (
        <Html>
            <Head />
            <Preview>
                Pet appointment in Joseph and Mary Veterinary Clinic
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
                                Appointment Confirmed!
                            </Heading>
                            <Text className="text-slate-600 text-sm leading-6 mt-6 ml-8">
                                Hi {name},
                            </Text>
                            <Text className="text-slate-600 text-sm leading-6 mt-4 ml-8 mr-8">
                                We are excited to see <strong>{pets}</strong>{" "}
                                for their
                                <strong> {type}</strong>.
                            </Text>
                            <Text className="text-slate-600 text-sm leading-4 mt-4 mr-8 ml-8">
                                Please arrive 5 minutes early. If you need to
                                reschedule, please click the link below to view
                                your dashboard.
                            </Text>

                            <Section className="mt-4 mb-4">
                                <Link
                                    href={`https://www.josephmary.me/v1/appointments/${id}`}
                                    className=" ml-8 text-sm underline "
                                >
                                    View Appointment Details
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
