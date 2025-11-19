"use client";

import { getTimeRange, TimeGrid } from "@mantine/dates";

export default function AdminTimePicker() {
    return (
        <TimeGrid
            data={getTimeRange({
                startTime: "08:00",
                endTime: "21:00",
                interval: "01:00",
            })}
            simpleGridProps={{
                type: "container",
                cols: { base: 1, "180px": 2, "320px": 3 },
                spacing: "xs",
            }}
            format="12h"
            withSeconds={false}
        />
    );
}
