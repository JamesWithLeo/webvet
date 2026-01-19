import { auth } from "@/auth";
import AppointmentWrapper from "@/components/appointment/AppointmentWrapper";
import { getAppointment } from "@/lib/db/appointments";
import { redirect, RedirectType, unauthorized } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user) unauthorized();

    console.log(session.user);
    const { id } = await params;
    const appointment = await getAppointment({
        ownerId: session.user.id,
        appointmentId: id,
    });
    if (!appointment) redirect("/v1/appointments/", RedirectType.replace);
    return (
        <div className="min-h-screen w-full relative lg:items-center md:px-16 p-8 flex gap-8 flex-col">
            <AppointmentWrapper data={appointment} />
        </div>
    );
}
