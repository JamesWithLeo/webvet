import MedicalKaban from "@/components/MedicalKaban";
import { getVetKanbanData } from "@/lib/db/invoice";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export default async function Page() {
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
