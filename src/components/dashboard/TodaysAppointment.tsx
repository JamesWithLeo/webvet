"use client";

import { AppointmentType } from "@/db/schema/appointments";
import { toTitleCase } from "@/lib/toTitleCase";
import {
    Button,
    Card,
    Text,
    Overlay,
    AvatarGroup,
    Avatar,
} from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
    data: {
        id: string;
        title: string;
        event_datetime: string;
        serviceType: "CHECK_UP" | "GROOMING" | "VACCINATION" | "DEWORMING";
        serviceName: string;
        pets: {
            id: string;
            name: string;
            photoUrl: string | null;
        }[];
    };
};

export default function TodaysAppointment({ data }: Props) {
    const router = useRouter();
    return (
        <div
            className={`flex-col h-full z-10 p-8
                      text-white flex 
                        bg-cover bg-center  overflow-clip relative
                        bg-linear-to-tr from-blue-500 to-pink-500
                     `}
        >
            <h1 className="text-sm text-white">Todays Appointmnet</h1>

            <div>
                <Link
                    href={"/v1/appointments/123"}
                    className="flex text-white font-bold items-center"
                >
                    <h1 className="text-2xl  underline ">
                        {toTitleCase(data?.title ?? "")}
                    </h1>
                    <IconArrowUpRight />
                </Link>
                <h1 className="text-sm text-white">
                    {" "}
                    {data?.event_datetime &&
                        new Date(data.event_datetime).toDateString()}{" "}
                    -{" "}
                    {data?.event_datetime &&
                        new Date(data.event_datetime).toLocaleTimeString()}
                </h1>
                <AvatarGroup>
                    {data?.pets.map((v) => (
                        <Avatar
                            size={"md"}
                            src={v.photoUrl}
                            key={`${v.id}-avatar`}
                        >
                            {v.name[0]}
                        </Avatar>
                    ))}
                </AvatarGroup>
            </div>
            <div className="h-full   flex items-end">
                <Button
                    variant="default"
                    size="xs"
                    onClick={() => {
                        router.push("/v1/appointments");
                    }}
                >
                    View more{" "}
                </Button>
            </div>
        </div>
    );
}
