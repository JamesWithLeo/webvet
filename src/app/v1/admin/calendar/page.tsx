import AdminTimePicker from "@/components/AdminTimePicker";
import AdminCalendar from "@/components/calendars/AdminCalendar";
import { Paper, SimpleGrid, Slider, Space, Stack } from "@mantine/core";

export default function Appointments() {
    return (
        <div className="w-full gap-2 flex flex-col h-full  p-16 light:bg-gray-50 ">
            <Paper className="gap-2" p={"xl"}>
                <h1 className="text-xl  font-bold text-gray-500">
                    Default Qouta
                </h1>
                <Slider
                    domain={[10, 100]}
                    color="primary"
                    size="md"
                    labelAlwaysOn
                    defaultValue={30}
                    min={10}
                    max={100}
                    marks={[
                        { value: 20, label: "20%" },
                        { value: 50, label: "50%" },

                        { value: 90, label: "90%" },
                        // { value: 100, label: "100%" },
                    ]}
                />
                <Space h={"xl"} />
                <SimpleGrid cols={2} w={"100%"} spacing={"xl"}>
                    <Stack w={"100%"}>
                        <h1 className="text-xl font-bold text-gray-500">
                            opening time:
                        </h1>
                        <AdminTimePicker />
                    </Stack>

                    <Stack w={"100%"}>
                        <h1 className="text-xl font-bold text-gray-500">
                            closing time:
                        </h1>
                        <AdminTimePicker />
                    </Stack>
                </SimpleGrid>
            </Paper>
            <AdminCalendar />
        </div>
    );
}
