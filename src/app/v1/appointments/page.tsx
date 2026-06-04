import { auth } from "@/auth";
import AppointmentController from "@/components/appointment/AppointmentController";
import AppointmentListWrapper from "@/components/appointment/AppointmentListWrapper";
import { getAppointments } from "@/lib/db/appointments";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if (!session?.user.id) unauthorized();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["appointments", session.user.id],
        queryFn: async () => {
            const { data } = await getAppointments({ id: session.user.id });
            return data;
        },
    });

    return (
        <>
            <div className="flex items-center gap-8 w-full h-screen flex-col ">
                <div className="min-h-screen w-full relative md:p-16 py-4 px-8 flex gap-8 flex-col">
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <AppointmentController />
                        <AppointmentListWrapper id={session.user.id} />
                    </HydrationBoundary>
                </div>
            </div>
        </>
    );
}
