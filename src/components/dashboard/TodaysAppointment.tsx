"use client";

import { Button, Card, Text, Overlay } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TodaysAppointment() {
    const router = useRouter();
    return (
        <Card
            withBorder
            h={"100%"}
            style={{
                backgroundImage: `url(${"https://7p6b2m8uq7.ufs.sh/f/EsozSsr1q3BbDFeZDlgWk9hYEXAxm63p7FtlngyIuMLSw1QG"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="grid grid-cols-1 z-10 text-white grid-rows-4">
                <h1 className="text-sm text-white">Todays Appointmnet</h1>

                <div>
                    <Link
                        href={"/v1/appointments/123"}
                        className="flex text-white font-bold items-center"
                    >
                        <h1 className="text-2xl  underline ">
                            Ara&apos;s Vaccination
                        </h1>
                        <IconArrowUpRight />
                    </Link>
                    <h1 className="text-sm text-white">
                        January 21, 2026 - 8:30 AM
                    </h1>
                </div>
                <div className="h-full  row-span-2 flex items-end">
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
            <Overlay
                gradient="linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 100%)"
                opacity={0.85}
                zIndex={0}
            />
        </Card>
    );
}
