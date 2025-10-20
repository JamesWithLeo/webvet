import GoogleButton from "@/components/GoogleButton";
import { ActionIcon, Button, Divider, TextInput } from "@mantine/core";
import Link from "next/link";
import { IconCalendarWeek, IconLogs, IconLeaf } from "@tabler/icons-react";
import Image from "next/image";
import LoginPage from "../login/page";
import Logo from "@/components/Logo";

export default function Signup() {
    return (
        <div className="items-center  grid grid-cols-[7fr_1px_7fr]  bg-[url('/pattern.svg')] grid-rows-1 min-h-dvh py-16 px-32 ">
            <section className="h-full flex flex-col items-center justify-center border  border-r-0 border-gray-200 bg-white">
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
                            href={"/v1/login"}
                            className="underline-offset-2 underline"
                        >
                            Log in
                        </Link>
                    </span>
                </div>
            </section>
            <Divider
                orientation="vertical"
                variant="dashed"
                size={"lg"}
                className=""
            />

            <section className="h-full flex items-center justify-center border bg-white border-l-0">
                <div className="grid gap-6">
                    <span className=" grid w-fit grid-cols-[.15fr_1fr] items-center ">
                        <ActionIcon variant="default" size={42}>
                            <IconCalendarWeek size={24} />
                        </ActionIcon>
                        <h1 className="text-xl font-bold">
                            Set Multiple Appointments
                        </h1>
                        <h1 className="row-start-2 h-max col-start-2">
                            Set appointments with ease, so you can plan visits{" "}
                            <br />
                            for all your pets without the back-and-forth.
                        </h1>
                    </span>

                    <span className=" grid w-fit grid-cols-[.15fr_1fr] items-center ">
                        <ActionIcon variant="default" size={42}>
                            <IconLogs size={24} />
                        </ActionIcon>
                        <h1 className="text-xl font-bold">Track pet</h1>
                        <h1 className="row-start-2 h-max col-start-2">
                            Track your pets’ medical history, vaccination
                            records, <br /> and upcoming checkups — all in one
                            convenient place.
                        </h1>
                    </span>

                    <span className=" grid w-fit grid-cols-[.15fr_1fr] items-center ">
                        <ActionIcon variant="default" size={42}>
                            <IconLeaf size={24} />
                        </ActionIcon>
                        <h1 className="text-xl font-bold">Hassle free!</h1>
                        <h1 className="row-start-2 h-max col-start-2">
                            Experience truly hassle-free pet care with <br /> a
                            platform designed to simplify scheduling, records,{" "}
                            <br /> and communication.
                        </h1>
                    </span>
                </div>
            </section>
        </div>
    );
}
