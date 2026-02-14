import { auth } from "@/auth";
import CalendarList from "@/components/appointment/CalendarList";
import checkSetup from "@/lib/checkSetup";
import { getAppointmentsWithType } from "@/lib/db/appointments";
import { getAllPets } from "@/lib/db/pets";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await auth();
    checkSetup(session);
    if (!session?.user) redirect("/");
    // const { data: appointments, error } = await getAppointments({
    //     id: session.user.id,
    // });
    const { data: appointments, error } = await getAppointmentsWithType({
        id: session.user.id,
    });
    const pets = await getAllPets(session.user.id);

    return (
        <div className="w-full gap-4 flex-col h-ful min-h-min flex">
            <CalendarList
                appointments={appointments}
                // pets={pets}
                error={error}
            />
        </div>
    );
}
