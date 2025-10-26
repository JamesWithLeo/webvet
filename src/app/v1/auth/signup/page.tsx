import GoogleButton from "@/components/GoogleButton";
import { ActionIcon, Button, TextInput } from "@mantine/core";
import Link from "next/link";
import { IconCalendarWeek, IconLogs, IconLeaf } from "@tabler/icons-react";
import Logo from "@/components/Logo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect, RedirectType } from "next/navigation";

const headlines = [
    {
        icon: <IconCalendarWeek size={24} />,
        headline: "Set Multiple Appointment",
        paragraph: (
            <>
                Set appointments with ease, so you can plan visits <br />
                for all your pets without the back-and-forth.
            </>
        ),
    },
    {
        icon: <IconLogs size={24} />,
        headline: "Track pet",
        paragraph: (
            <>
                Track your pets’ medical history, vaccination records, <br />{" "}
                and upcoming checkups — all in one convenient place.
            </>
        ),
    },
    {
        icon: <IconLeaf size={24} />,
        headline: "Hassle free!",
        paragraph: (
            <>
                Experience truly hassle-free pet care with a platform <br />{" "}
                designed to simplify scheduling, records, and communication.
            </>
        ),
    },
];

export default async function Signup() {
    const session = await getServerSession(authOptions);
    if (session?.user.id) redirect("/");
    return (
        <div className="items-centers gap-0 grid grid-cols-1 xl:grid-cols-[1fr_1fr] grid-rows-[auto_.5fr] bg-[url('/pattern.svg')] xl:grid-rows-1 min-h-dvh xl:px-32 ">
            <section className=" flex flex-col h-screen border-l-2 border-dashed items-center justify-center   bg-white">
                <div className=" w-full flex mb-16 justify-center">
                    <Logo />
                </div>
                <div className="flex gap-3.5 w-sm flex-col ">
                    <h1 className="text-4xl font-bold mb-6">
                        Care for your pet, anytime, anywhere.
                    </h1>
                    <TextInput label="Email" />
                    <Button color="#043343">Sign up</Button>

                    <GoogleButton />

                    <span className="w-full flex justify-center gap-4">
                        <h1 className="text-center ">
                            Already have an account?
                        </h1>
                        <Link
                            href={"/v1/auth/login"}
                            className="underline-offset-2 underline"
                        >
                            Log in
                        </Link>
                    </span>
                </div>
            </section>

            <section className="h-full flex w-full items-center border-r-2 border-dashed bg-white justify-center pb-16 xl:pb-0  md:border-l-0">
                <div className="grid xl:gap-6 justify-center gap-16 w-full items-center">
                    {headlines.map((h, index) => (
                        <FeatureHeadline
                            icon={h.icon}
                            headline={h.headline}
                            paragraph={h.paragraph}
                            key={`headline-${index}`}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

function FeatureHeadline({
    icon,
    headline,
    paragraph,
}: {
    icon: React.ReactNode;
    headline: string;
    paragraph: React.ReactNode;
}) {
    return (
        <span className=" grid place-items-center xl:place-items-baseline flex-col  w-full grid-cols-1 justify-center grid-rows-3 xl:grid-cols-[.15fr_1fr] items-center ">
            <ActionIcon variant="default" size={42}>
                {icon}
            </ActionIcon>
            <h1 className="text-xl font-bold">{headline}</h1>
            <h1 className="xl:row-start-2 xl:text-left text-center h-max xl:col-start-2">
                {paragraph}
            </h1>
        </span>
    );
}
