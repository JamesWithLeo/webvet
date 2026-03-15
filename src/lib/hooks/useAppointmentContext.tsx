"use client";

import { ServiceMergePriceType } from "@/db/schema/services";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

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

    return (
        <AppointmentContext.Provider
            value={{
                selections,
                toggleService,
                removePet,
                clearAll,
                getAvailableDays,
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
