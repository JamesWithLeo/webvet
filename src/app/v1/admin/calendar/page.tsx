import AdminCalendarSchedules from "@/components/admin/AdminCalendarSchedules";
import CalendarCapacityAndLimit from "@/components/admin/CalendarCapacityAndLimit";
import AdminCalendar from "@/components/calendars/AdminCalendar";
import { getAppointmentSchedules } from "@/lib/db/appointments";
import { Box, Divider, Text } from "@mantine/core";

export default async function Appointments() {
    const appointmentSchedules = await getAppointmentSchedules();
    return (
        <div className="flex justify-center items-center  w-full flex-col h-auto lg:p-16 p-8 ">
            <div className="w-full max-w-7xl gap-16 flex flex-col h-auto   ">
                <Box className="w-full flex flex-col h-full">
                    <Text size="lg" fw={700} c="dimmed" mb="xl" tt="uppercase">
                        Calendar
                    </Text>
                    <AdminCalendar />
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
                {/* <SimpleGrid cols={2} w={"100%"} spacing={"xl"}>
                    <Stack w={"100%"}>
                        <h1 className="text-md font-bold text-gray-500">
                            opening time:
                        </h1>
                        <AdminTimePicker />
                    </Stack>

                    <Stack w={"100%"}>
                        <h1 className="text-md font-bold text-gray-500">
                            closing time:
                        </h1>
                        <AdminTimePicker />
                    </Stack>
                </SimpleGrid> */}
            </div>
        </div>
    );
}
