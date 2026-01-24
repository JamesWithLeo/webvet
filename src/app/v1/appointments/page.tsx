import { auth } from "@/auth";
import AppointmentController from "@/components/appointment/AppointmentController";
import AppointmentListWrapper from "@/components/appointment/AppointmentListWrapper";
import { getAppointments } from "@/lib/db/appointments";
import { unauthorized } from "next/navigation";

export default async function AppointmentPage() {
    const session = await auth();
    if (!session?.user.id) unauthorized();
    const { data, error } = await getAppointments({ id: session.user.id });

    return (
        <>
            <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
                <div className="min-h-screen w-full relative md:p-16 px-4 flex gap-8 flex-col">
                    <AppointmentController />
                    <AppointmentListWrapper data={data} error={error} />
                </div>
            </div>
        </>
    );
}
