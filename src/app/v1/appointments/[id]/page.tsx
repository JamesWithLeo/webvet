import { auth } from "@/auth";
import AppointmentWrapper from "@/components/appointment/AppointmentWrapper";
import { getAppointmentWithDetails } from "@/lib/db/appointments";
import { notFound, unauthorized } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user) unauthorized();

    const { id } = await params;
    const { data } = await getAppointmentWithDetails({
        appointmentId: id,
        ownerId: session.user.id,
    });
    if (!data) notFound();
    return (
        <div className="min-h-screen w-full relative lg:items-center md:px-16 p-8 flex gap-8 flex-col">
            <AppointmentWrapper data={data} />
        </div>
    );
}
