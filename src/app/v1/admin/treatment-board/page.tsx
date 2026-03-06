import { auth } from "@/auth";
import MedicalKaban from "@/components/MedicalKaban";
import { getVetKanbanData } from "@/lib/db/invoice";
import { QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { unauthorized } from "next/navigation";

export default async function Page() {
    const session = await auth();
    const role = session?.user.role;
    if (role !== "vet" && role !== "admin" && Boolean(role)) unauthorized();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["medical", "admin"],
        queryFn: () =>
            getVetKanbanData(
                dayjs().format("YYYY-MM-DD"),
                dayjs().endOf("day").format("YYYY-MM-DD")
            ),
    });
    return (
        <div className="bg-gray-50 w-full h-screen p-8 ">
            <MedicalKaban />
        </div>
    );
}
