import { auth } from "@/auth";
import MedicalKaban from "@/components/MedicalKaban";
import { getVetKanbanData } from "@/lib/db/invoice";
import { QueryClient } from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

export default async function Page() {
    const session = await auth();
    const role = session?.user.role;
    if (role !== "vet" && role !== "admin" && Boolean(role)) unauthorized();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["medical", "admin"],
        queryFn: getVetKanbanData,
    });
    return (
        <div className="bg-gray-50 w-full h-screen p-16 ">
            <MedicalKaban />
        </div>
    );
}
