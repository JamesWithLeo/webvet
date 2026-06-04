import { auth } from "@/auth";
import AppointmentStepper from "@/components/appointment/AppointmentStepper";
import { getAppointmentSchedules, getBlockDates } from "@/lib/db/appointments";
import { getAllPetsIdName } from "@/lib/db/pets";
import { getServicesGrouped } from "@/lib/db/services";
import { AppointmentProvider } from "@/lib/hooks/useAppointmentContext";
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

    const serviceWithPrices = await getServicesGrouped();

    return (
        <>
            <div className="grid grid-rows-[auto_auto_8fr] min-h-screen  grid-cols-1  gap-8  w-full items-center p-8  h-full md:px-16">
                <AppointmentProvider schedules={serviceSchedules}>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <AppointmentStepper
                            services={serviceWithPrices}
                            pets={pets}
                            schedules={serviceSchedules}
                        />
                    </HydrationBoundary>
                </AppointmentProvider>
            </div>
        </>
    );
}
