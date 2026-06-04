import { auth } from "@/auth";
import CreatePetsWrapper from "@/components/pet/CreatePetsWrapper";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if (!session || !session.user.id) {
        redirect("/");
    }
    return (
        <div className="flex items-center gap-8 w-full h-full min-h-dvh  flex-col   ">
            <CreatePetsWrapper id={session.user.id} />
        </div>
    );
}
