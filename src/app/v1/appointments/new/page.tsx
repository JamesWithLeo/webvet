import { auth } from "@/auth";
import AppointmentStepper from "@/components/appointment/AppointmentStepper";
import { getAppointmentSchedules, getBlockDates } from "@/lib/db/appointments";
import { getAllPetsIdName } from "@/lib/db/pets";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function AppointmentPage() {
    const session = await auth();
    if (!session) redirect("/");
    const pets = await getAllPetsIdName(session?.user.id);
    const serviceSchedules = await getAppointmentSchedules();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["blockedDates"],
        queryFn: getBlockDates,
    });
    return (
        <>
            <div className="grid grid-rows-[auto_auto_8fr] min-h-screen  grid-cols-1  gap-8  w-full items-center pt-16 pb-16  h-full md:px-16 px-10">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <AppointmentStepper
                        pets={pets}
                        schedules={serviceSchedules}
                    />
                </HydrationBoundary>
            </div>
        </>
    );
}
