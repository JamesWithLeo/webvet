"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminAppointment } from "@/db/schema/appointments";
import { useState } from "react";
import { DataTableSortStatus } from "mantine-datatable";
import { filter, sortBy } from "lodash";
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

    const [filterInvoiceStatus, setFilterInvoiceStatus] = useState<
        string | null
    >(null);
    const [filterPaymentStatus, setFilterPaymentStatus] = useState<
        string | null
    >(null);

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

            // 1. Name Filter
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

            // 2. Date Range Filter
            const [start, end] = dateRange;
            if (start) {
                filtered = filtered.filter((appt) => {
                    const apptDate = dayjs(appt.event_datetime);
                    const startDate = dayjs(start).startOf("day");

                    if (end) {
                        const endDate = dayjs(end).endOf("day");
                        return (
                            apptDate.isAfter(startDate) &&
                            apptDate.isBefore(endDate)
                        );
                    } else {
                        return apptDate.isSame(startDate, "day");
                    }
                });
            }

            if (filterInvoiceStatus && filterInvoiceStatus !== "ALL") {
                filtered = filtered.filter(
                    (appt) => appt.invoice?.status === filterInvoiceStatus
                );
            }

            // 4. Payment Status Filter
            if (filterPaymentStatus && filterPaymentStatus !== "ALL") {
                filtered = filtered.filter(
                    (appt) =>
                        appt.invoice?.paymentStatus === filterPaymentStatus
                );
            }

            // 5. Sort
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
        // --- Exporting new state and setters ---
        setFilterInvoiceStatus,
        setFilterPaymentStatus,
        filterPaymentStatus,
        filterInvoiceStatus,
    };
}
