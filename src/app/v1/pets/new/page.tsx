import { auth } from "@/auth";
import CreatePetsWrapper from "@/components/pets/CreatePetsWrapper";
import { getPetsSpeciesExcept } from "@/lib/db/pets";
import { redirect } from "next/navigation";

export default async function Page() {
    const species = await getPetsSpeciesExcept(["other"]);
    const session = await auth();
    if (!session || !session.user.id) {
        redirect("/");
    }
    return (
        <div className="flex items-center gap-8 w-full h-full min-h-dvh  flex-col   ">
            <CreatePetsWrapper species={species} id={session.user.id} />
        </div>
    );
}
