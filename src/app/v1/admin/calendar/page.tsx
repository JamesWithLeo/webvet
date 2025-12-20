"use client";
import AdminCalendar from "@/components/calendars/AdminCalendar";
import {
    Flex,
    Group,
    Paper,
    RangeSlider,
    SimpleGrid,
    Slider,
    Space,
    Stack,
    Switch,
} from "@mantine/core";

export default function Appointments() {
    function valueLabelFormat(value: number) {
        const units = ["AM", "PM"];

        let unitIndex = 0;
        let timeValue;
        console.log(value);

        // The full range is value=0 (06:00 AM) to value=100 (06:00 PM)
        if (value >= 0 && value <= 100) {
            // 1. Calculate total minutes elapsed over the 12-hour span (720 minutes).
            const durationInMinutes = 720;
            const minutesElapsed = (value / 100) * durationInMinutes;

            // 2. CRUCIAL FIX: SNAP the elapsed time to the nearest 30-minute mark.
            // The closest multiple of 30 is found by:
            // a. Dividing by 30 (getting the number of half-hour intervals).
            // b. Rounding that number to the nearest whole interval.
            // c. Multiplying by 30 again.
            const snappedMinutesElapsed = Math.round(minutesElapsed / 30) * 30;

            // 3. Start at 6:00 AM (360 minutes past midnight) and add the snapped time.
            let totalMinutesPastMidnight = 360 + snappedMinutesElapsed;

            // 4. Calculate 24-hour time components
            let hours24 = Math.floor(totalMinutesPastMidnight / 60) % 24;
            let minutes = totalMinutesPastMidnight % 60; // Now guaranteed to be 0 or 30

            // 5. Determine AM/PM
            const ampm = hours24 >= 12 ? "PM" : "AM";

            // 6. Convert 24-hour hour to 12-hour hour (13 -> 1, 12 -> 12, 0 -> 12)
            let hours12 = hours24 % 12;
            hours12 = hours12 === 0 ? 12 : hours12;

            // 7. Format the final string
            const hh = String(hours12).padStart(2, "0");
            const mm = String(minutes).padStart(2, "0");

            timeValue = `${hh}:${mm} ${ampm}`;
        } else {
            timeValue = "Value out of range (must be 0-100)";
        }

        //
        return timeValue;
    }
    return (
        <div className="w-full gap-2 flex flex-col h-auto  p-16 light:bg-gray-50 ">
            <Paper className="gap-4 mb-8">
                <Stack gap={"xl"}>
                    <Group align="centers" w={"50%"}>
                        <h1 className="text-md  font-bold text-gray-500">
                            Manual Approval
                        </h1>
                        <Switch size="lg" onLabel="ON" offLabel="OFF" />
                    </Group>
                    <Group
                        align="centers"
                        justify="space-between"
                        gap={0}
                        w={"50%"}
                    >
                        <h1 className="text-md  font-bold text-gray-500">
                            Default Qouta
                        </h1>
                        <Slider
                            w={"100%"}
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
                    </Group>
                    <Group
                        align="centers"
                        justify="space-between"
                        gap={0}
                        w={"50%"}
                    >
                        <h1 className="text-md font-bold text-gray-500">
                            Default Business Hours
                        </h1>
                        <RangeSlider
                            w={"100%"}
                            restrictToMarks
                            // labelAlwaysOn
                            label={valueLabelFormat}
                            defaultValue={[5, 15]}
                            marks={[
                                { value: 0, label: "06:00 AM" },
                                { value: 5 },
                                { value: 10 },
                                { value: 15 },
                                { value: 20 },
                                { value: 25 },
                                { value: 30 },
                                { value: 35 },
                                { value: 40 },
                                { value: 45 },
                                { value: 50 },
                                { value: 55 },
                                { value: 60 },
                                { value: 65 },
                                { value: 70 },
                                { value: 75 },
                                { value: 80 },
                                { value: 85 },
                                { value: 90 },
                                { value: 95 },
                                { value: 100, label: "06:00 PM" },
                            ]}
                        />
                    </Group>
                </Stack>
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
            </Paper>
            <AdminCalendar />
        </div>
    );
}
