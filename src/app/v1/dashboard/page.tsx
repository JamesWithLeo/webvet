import { auth } from "@/auth";
import CalendarList from "@/components/appointment/CalendarList";
import checkSetup from "@/lib/checkSetup";
import { getAppointments } from "@/lib/db/appointments";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await auth();
    checkSetup(session);
    if (!session?.user) redirect("/");
    const appointments = await getAppointments({ id: session.user.id });
    return (
        <div className="w-full gap-4 flex-col h-ful min-h-min flex">
            <CalendarList appointments={appointments} />
        </div>
    );
}
