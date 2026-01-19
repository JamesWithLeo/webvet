import { auth } from "@/auth";
import PetProfile from "@/components/pet/PetProfile";
import PetProfileAppointment from "@/components/pet/PetProfileAppointment";
import { getAppointmentsByPet } from "@/lib/db/appointments";
import { getPet } from "@/lib/db/pets";
import { redirect, RedirectType, unauthorized } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    if (!session?.user) unauthorized();
    const { id: petId } = await params;

    const [pet, appointment] = await Promise.all([
        getPet(petId, session.user.id),
        getAppointmentsByPet(petId),
    ]);
    if (!pet || !appointment) redirect("/v1/pets/", RedirectType.replace);
    return (
        <div className="min-h-screen w-full relative lg:items-center md:px-16 p-8 flex gap-8 flex-col">
            <div className="flex items-center gap-4 max-w-7xl w-full lg:gap-8 flex-col">
                <PetProfile data={pet} />
                <PetProfileAppointment data={appointment} />
            </div>
        </div>
    );
}
