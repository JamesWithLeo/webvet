import { auth } from "@/auth";
import AppointmentStepper from "@/components/appointment/AppointmentStepper";
import { getAppointmentSchedules } from "@/lib/db/appointments";
import { getAllPetsIdName } from "@/lib/db/pets";
import { redirect } from "next/navigation";

export default async function AppointmentPage() {
    const session = await auth();
    if (!session) redirect("/");
    const pets = await getAllPetsIdName(session?.user.id);
    const serviceSchedules = await getAppointmentSchedules();
    return (
        <>
            <div className="grid grid-rows-[auto_auto_8fr] min-h-screen  grid-cols-1  gap-8  w-full items-center pt-16 pb-16  h-full md:px-16 px-10">
                <AppointmentStepper pets={pets} schedules={serviceSchedules} />
            </div>
        </>
    );
}
