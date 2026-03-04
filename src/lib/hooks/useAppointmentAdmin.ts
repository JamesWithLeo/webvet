"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminAppointment } from "@/db/schema/appointments";
import { useState } from "react";
import { DataTableSortStatus } from "mantine-datatable";
import { sortBy } from "lodash";
import dayjs from "dayjs";

export default function useAppointmentAdmin(
    scope: "all" | "incoming" | "past"
) {
    const [sortStatus, setSortStatus] = useState<
        DataTableSortStatus<AdminAppointment>
    >({
        columnAccessor: "event_datetime",
        direction: "desc",
    });

    const [searchName, setSearchName] = useState<string>("");
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([
        null,
        null,
    ]);

    const query = useQuery<AdminAppointment[], Error>({
        queryKey: ["appointments", "admin", scope],
        queryFn: async () => {
            const res = await fetch(`/api/admin/appointments?scope=${scope}`);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch");
            }

            const data = await res.json();
            return data as AdminAppointment[];
        },
        staleTime: 1000 * 60 * 5,
        select: (data) => {
            let filtered = data;

            if (searchName) {
                const lowerSearch = searchName.toLowerCase();
                filtered = filtered.filter(
                    (appt) =>
                        appt.user.firstName
                            ?.toLowerCase()
                            .includes(lowerSearch) ||
                        appt.user.lastName?.toLowerCase().includes(lowerSearch)
                );
            }

            const [start, end] = dateRange;
            if (start) {
                filtered = filtered.filter((appt) => {
                    const apptDate = dayjs(appt.event_datetime);
                    const startDate = dayjs(start).startOf("day");

                    if (end) {
                        // Range mode: between start and end
                        const endDate = dayjs(end).endOf("day");
                        return (
                            apptDate.isAfter(startDate) &&
                            apptDate.isBefore(endDate)
                        );
                    } else {
                        // Single date mode: only same day
                        return apptDate.isSame(startDate, "day");
                    }
                });
            }

            // 3. Sort (Existing)
            const sorted = sortBy(
                filtered,
                sortStatus.columnAccessor
            ) as AdminAppointment[];
            return sortStatus.direction === "desc" ? sorted.reverse() : sorted;
        },
    });
    return {
        ...query,
        sortStatus,
        setSortStatus,
        searchName,
        setSearchName,
        dateRange,
        setDateRange,
    };
}
