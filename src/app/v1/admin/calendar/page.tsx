import AdminCalendar from "@/components/calendars/AdminCalendar";
import { Paper } from "@mantine/core";

export default function Appointments() {
    return (
        <div className="w-full gap-2 flex flex-col h-screen p-16 light:bg-gray-50 ">
            <Paper withBorder className="gap-2 p-2">
                <h1 className="text-xl font-bold text-gray-500">
                    Default Qouta: 30
                </h1>
                <h1 className="text-xl font-bold text-gray-500">
                    opening time: 8:00am
                </h1>
                <h1 className="text-xl font-bold text-gray-500">
                    closing time: 5:00pm
                </h1>
            </Paper>
            <AdminCalendar />
        </div>
    );
}
