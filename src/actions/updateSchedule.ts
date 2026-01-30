"use server";

import { db } from "@/db";
import { appointmentSchedules } from "@/db/schema/appointments";
import {
    ServiceScheduleInput,
    updateServiceScheduleSchema,
} from "@/lib/validators/serviceScheduleZodScheme";
import { sql } from "drizzle-orm";

export default async function UpdateSchedule(
    prevState: any,
    data: ServiceScheduleInput
) {
    const parsed = updateServiceScheduleSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            error: "Service schedule data failed the validation",
        };
    }

    const updateData = Object.entries(parsed.data).map(([type, days]) => ({
        appointmentType: type,
        availableDays: days,
    }));

    try {
        const result = await db
            .insert(appointmentSchedules)
            .values(updateData)
            .onConflictDoUpdate({
                target: appointmentSchedules.appointmentType,
                set: {
                    availableDays: sql`excluded.available_days`,
                    updatedAt: new Date(),
                },
            })
            .returning();

        if (result && result.length >= 0)
            return {
                success: true,
                data: result,
            };

        return {
            success: false,
        };
    } catch (error: any) {
        console.error(error);
        return {
            error: "An unexpected database error occurred.",
            success: false,
        };
    }
}
