import { pgEnum } from "drizzle-orm/pg-core";

export const appointmentStatusValues = [
    "SCHEDULED",
    "CANCELLED",
    "COMPLETED",
    "NO_SHOW",
] as const;
export const appointmentStatusType = pgEnum(
    "appointment_status",
    appointmentStatusValues
);
export const appointmentTypeValues = [
    "CHECK_UP",
    "GROOMING",
    "VACCINATION",
    "DEWORMING",
] as const;

export const appointmentType = pgEnum(
    "appointment_type",
    appointmentTypeValues
);
