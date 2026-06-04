"use client";

import { ServiceMergePriceType } from "@/db/schema/services";
import { useQuery } from "@tanstack/react-query";
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";

type PetId = string;

type SelectionItem = Pick<ServiceMergePriceType, "id" | "type" | "title"> & {
    name: string;
    priceAtBooking: string;
};
type Schedules =
    | {
          id: number;
          appointmentType:
              | "CHECK_UP"
              | "GROOMING"
              | "VACCINATION"
              | "DEWORMING";
          availableDays: number[];
          updatedAt: Date;
      }[]
    | null;

type SelectionState = Record<PetId, SelectionItem[]>;

interface AppointmentContextType {
    selections: SelectionState;
    toggleService: (petId: PetId, service: SelectionItem) => void;
    getAvailableDays: (schedules: Schedules) => number[];
    removePet: (petId: PetId) => void;
    clearAll: () => void;
    monthEvents: {
        id: string;
        title: string;
        start: string;
        allDay: boolean;
        display: string;
        backgroundColor: string;
        textColor: string;
    }[];
    timeEvents: {
        id: string;
        title: string;
        start: string;
        allDay: boolean;
        display: string;
        backgroundColor: string;
        borderColor: string;
        textColor: string;
    }[];
    setRange: Dispatch<
        SetStateAction<{
            start: string;
            end: string;
        }>
    >;
    allowedDays: number[];
    hasConflict: boolean;
    incompatibleServices: { type: string; days: number[] }[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
    undefined
);

export function AppointmentProvider({
    children,
    schedules,
}: {
    children: ReactNode;
    schedules: Schedules;
}) {
    const [selections, setSelections] = useState<SelectionState>({});

    const [range, setRange] = useState({ start: "", end: "" });
    const { data: rawAppointments } = useQuery({
        queryKey: ["appointments", range.start, range.end],
        queryFn: async () => {
            const res = await fetch(
                `/api/calendar?start=${range.start}&end=${range.end}`
            );
            if (!res.ok) throw new Error("Failed to fetch appointments");

            const data = await res.json();
            return data;
        },
        enabled: !!range.start,
    });

    const { monthEvents, timeEvents } = useAppointmentSummaries(
        rawAppointments || []
    );

    const toggleService = (petId: string, service: SelectionItem) => {
        setSelections((prev) => {
            const current = prev[petId] || [];
            const isSelected = current.some((item) => item.id === service.id);

            const next = isSelected
                ? current.filter((item) => item.id !== service.id)
                : [
                      ...current,
                      {
                          id: service.id,
                          type: service.type,
                          title: service.title,
                          name: service.name,
                          priceAtBooking: service.priceAtBooking,
                      },
                  ];

            const newState = { ...prev, [petId]: next };
            if (next.length === 0) delete newState[petId];
            return newState;
        });
    };

    const getAvailableDays = (schedules: Schedules) => {
        // 1. Get all unique types currently selected (e.g., ["GROOMING", "VACCINATION"])
        // Flattening the object values gives us the SelectionItem[]
        const selectedTypes = Array.from(
            new Set(
                Object.values(selections)
                    .flat()
                    .map((item) => item.type)
            )
        );

        // 2. If no services are selected or schedules haven't loaded, disabled all days
        if (selectedTypes.length === 0 || !schedules) {
            return [];
        }

        // 3. Get the availableDays arrays for each selected type
        const requiredSchedules = selectedTypes.map((type) => {
            const match = schedules.find((s) => s.appointmentType === type);
            return match ? match.availableDays : [];
        });

        // 4. Find the Intersection: only days that exist in EVERY required schedule
        const sharedDays = requiredSchedules.reduce(
            (intersection, currentDays) => {
                return intersection.filter((day) => currentDays.includes(day));
            }
        );

        return sharedDays;
    };

    const removePet = (pId: PetId) => {
        const petId = String(pId);
        setSelections((prev) => {
            const newState = { ...prev };
            delete newState[petId];
            return newState;
        });
    };

    const clearAll = () => setSelections({});

    const derivedScheduleData = useMemo(() => {
        // 1. Get unique types
        const allItems = Object.values(selections).flat();
        const selectedTypes = Array.from(new Set(allItems.map((i) => i.type)));

        // 2. Initial State: If nothing selected, you can decide to show all or none.
        // Given your "strict" requirement:
        if (selectedTypes.length === 0 || !schedules) {
            return {
                allowedDays: [],
                hasConflict: false,
                incompatibleServices: [],
            };
        }

        // 3. Get required day arrays
        const typeDetails = selectedTypes.map((type) => {
            const match = schedules.find((s) => s.appointmentType === type);
            return { type, days: match ? match.availableDays : [] };
        });

        // 4. Calculate Intersection
        const allowed = typeDetails.reduce(
            (intersection, current) => {
                return intersection.filter((day) => current.days.includes(day));
            },
            [0, 1, 2, 3, 4, 5, 6]
        ); // Start with all days for the intersection

        const conflict = allItems.length > 0 && allowed.length === 0;

        return {
            allowedDays: allowed,
            hasConflict: conflict,
            incompatibleServices: typeDetails,
        };
    }, [selections, schedules]);

    // useEffect(() => {
    //     console.log(rawAppointments);
    // }, [rawAppointments]);

    return (
        <AppointmentContext.Provider
            value={{
                selections,
                toggleService,
                removePet,
                clearAll,
                getAvailableDays,
                monthEvents,
                timeEvents,
                setRange,
                ...derivedScheduleData,
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
}

// --- Custom Hook ---

export const useAppointment = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error(
            "useAppointment must be used within an AppointmentProvider"
        );
    }
    return context;
};

const MAX_CAPACITY = 3;

export function useAppointmentSummaries(rawAppointments: any[]) {
    return useMemo(() => {
        if (!rawAppointments || rawAppointments.length === 0) {
            return { monthEvents: [], timeEvents: [] };
        }

        // Accumulators for grouping
        const dailyCount: Record<string, number> = {};
        const hourlyCount: Record<string, number> = {};

        rawAppointments.forEach((apt) => {
            // event_datetime is a string from DB, Date() handles ISO strings perfectly
            const d = new Date(apt.event_datetime);

            if (isNaN(d.getTime())) return; // Skip invalid dates

            const dateKey = d.toLocaleDateString("en-CA");
            const hourPart = String(d.getHours()).padStart(2, "0");
            const hourKey = `${dateKey}T${hourPart}:00:00`;

            dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
            hourlyCount[hourKey] = (hourlyCount[hourKey] || 0) + 1;
        });

        // Format for Month View (Daily Blocks)
        const monthEvents = Object.entries(dailyCount).map(([date, count]) => ({
            id: `month-${date}`,
            title: `${count} ${count > 1 ? "Appointments" : "Appointment"}`,
            start: date,
            allDay: true,
            // display: "block",
            display: "list-item",
            backgroundColor: "#14678f", // Clinic Blue
            textColor: "#ffffff",
        }));

        const timeEvents = Object.entries(hourlyCount).map(([slot, count]) => {
            const isFull = count >= MAX_CAPACITY;

            // 1. Parse the start date
            const startDate = new Date(slot);

            // 2. Create the end date by adding 1 hour
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 1);

            // 3. Format the end date back to "YYYY-MM-DDTHH:mm:ss"
            // We use a custom format to avoid UTC offsets from .toISOString()
            const endSlot =
                endDate.getFullYear() +
                "-" +
                String(endDate.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(endDate.getDate()).padStart(2, "0") +
                "T" +
                String(endDate.getHours()).padStart(2, "0") +
                ":00:00";

            return {
                id: `time-${slot}`,
                title: `(${count}/${MAX_CAPACITY}) Slots`,
                start: slot,
                end: endSlot, // Updated this
                allDay: false,
                display: "block",
                backgroundColor: isFull ? "#e03131" : "#14678f",
                borderColor: isFull ? "#c92a2a" : "#0e4a68",
                textColor: "#ffffff",
                extendedProps: { count, isFull },
            };
        });
        return { monthEvents, timeEvents };
    }, [rawAppointments]);
}
