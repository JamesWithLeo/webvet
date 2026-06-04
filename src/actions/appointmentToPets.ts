"use server";

import { auth } from "@/auth";
import { AppointmentToPetsTypeModel } from "@/db/schema/appointments";
import { saveAppointmentToPetsToDbAdmin } from "@/lib/db/appointments";
import { unauthorized } from "next/navigation";
import { revalidatePath } from "next/cache";
import translateDatabaseError from "@/lib/TranslateDatabaseError";

export const InsertAppointmentToPetsAdmin = async (
    prevState: any,
    data: Pick<
        AppointmentToPetsTypeModel,
        "appointmentId" | "petId" | "priceAtBooking" | "serviceId" | "source"
    >
) => {
    const session = await auth();
    if (session?.user.role !== "admin" && session?.user.role !== "staff") {
        unauthorized();
    }

    if (!data.appointmentId || !data.petId || !data.serviceId) {
        return { error: "Missing required relationship IDs.", success: false };
    }

    if (Number(data.priceAtBooking) < 0) {
        return { error: "Price cannot be negative.", success: false };
    }

    try {
        // 3. Database Operation
        const insertedId = await saveAppointmentToPetsToDbAdmin(data);

        // 4. Update the UI Cache
        // Revalidate the specific appointment page or the list
        revalidatePath(`/v1/clinic/invoice/new/${data.appointmentId}`);

        return {
            error: null,
            insertedId: insertedId,
            success: true,
        };
    } catch (error: any) {
        const dbCode = error.code || error.cause?.code;
        const dbConstraint = error.constraint || error.cause?.constraint;

        const userFriendlyMessage = translateDatabaseError(
            dbCode,
            dbConstraint
        );

        return {
            success: false,
            error: userFriendlyMessage,
        };
    }
};
