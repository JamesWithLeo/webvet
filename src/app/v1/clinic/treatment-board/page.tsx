import { auth } from "@/auth";
import MedicalKaban from "@/components/MedicalKaban";
import { getVetKanbanData } from "@/lib/db/invoice";
import { Stack } from "@mantine/core";
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
        <Stack bg={"gray.0"} className="w-full min-h-dvh" p={"md"}>
            <MedicalKaban />
        </Stack>
    );
}
