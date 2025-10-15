import AppointmentCalendar from "@/components/AppointmentCalendar";
import { Button } from "@/components/ui/button";
import { appointmentTypeValues } from "@/db/schema/appointments";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{
        name: string;
        type: string;
    }>;
}) {
    const name = (await params).name.replaceAll("-", " ");
    const type = (await params).type.replaceAll("-", "_");

    const isValidType = appointmentTypeValues.find((v) => {
        if ((v as string).toLowerCase() === type) {
            return true;
        } else return false;
    });

    if (!isValidType) {
        redirect("/v1/appointments");
    }
    return (
        <>
            <div className="flex px-16 py-8 flex-col items-start  min-w-dvw   h-full min-h-dvh ">
                <h1>{name}</h1>
                <h1>{type.replaceAll("_", " ")}</h1>
                <AppointmentCalendar type={type} name={name} />
                <Button asChild variant={"link"}>
                    <Link href={"/"}>Back to Home</Link>
                </Button>
            </div>
        </>
    );
}
