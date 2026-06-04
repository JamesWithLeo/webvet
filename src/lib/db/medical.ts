import { db } from "@/db";
import { medicalLogs } from "@/db/schema/medicalLogs";
import { eq, and } from "drizzle-orm";

export const getMedicalLog = async (
    appId: string,
    petId: string,
    serviceId: string
) => {
    const log = await db
        .select()
        .from(medicalLogs)
        .where(
            and(
                eq(medicalLogs.appointmentId, appId),
                eq(medicalLogs.petId, petId),
                eq(medicalLogs.serviceId, serviceId)
            )
        )
        .limit(1);

    return log[0] || null;
};
