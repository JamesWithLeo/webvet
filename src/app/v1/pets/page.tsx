import { auth } from "@/auth";
import BottomPattern from "@/components/common/BottomPattern";
import PetWrapper from "@/components/pet/PetWrapper";
import { getAllPets } from "@/lib/db/pets";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if (!session) redirect("/");
    const pets = await getAllPets(session?.user.id);
    return (
        <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
            <div className="min-h-screen w-full relative md:px-16 px-4 py-4 flex gap-8 flex-col">
                <PetWrapper pets={pets} />
            </div>
            <BottomPattern />
        </div>
    );
}
