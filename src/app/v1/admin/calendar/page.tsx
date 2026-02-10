import AdminCalendarSchedules from "@/components/admin/AdminCalendarSchedules";
import CalendarCapacityAndLimit from "@/components/admin/CalendarCapacityAndLimit";
import AdminCalendar from "@/components/calendars/AdminCalendar";
import { getAppointmentSchedules, getBlockDates } from "@/lib/db/appointments";
import { Box, Divider, Text } from "@mantine/core";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

export default async function Page() {
    const appointmentSchedules = await getAppointmentSchedules();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["blockedDates"],
        queryFn: getBlockDates,
    });
    return (
        <div className="flex justify-center items-center  w-full flex-col h-auto lg:p-16 p-8 ">
            <div className="w-full max-w-7xl gap-16 flex flex-col h-auto   ">
                <Box className="w-full flex flex-col gap-8 h-full">
                    <Text size="lg" fw={700} c="dimmed" mb="xl" tt="uppercase">
                        Calendar
                    </Text>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <AdminCalendar />
                    </HydrationBoundary>
                </Box>
                <Divider />
                <Box>
                    <AdminCalendarSchedules schedules={appointmentSchedules} />
                </Box>

                <Divider />

                <Box>
                    <Text size="lg" fw={700} c="dimmed" mb="xl" tt="uppercase">
                        Capacity & Limits
                    </Text>
                    <CalendarCapacityAndLimit />
                </Box>
            </div>
        </div>
    );
}
