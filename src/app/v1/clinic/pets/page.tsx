import { auth } from "@/auth";
import PetTable from "@/components/PetTable";
import { getAllPetsAdmin } from "@/lib/db/pets";
import { Title, Stack } from "@mantine/core";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

export default async function Pets() {
    const session = await auth();
    if (!session) {
        unauthorized();
    }

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["pets", "admin"],
        queryFn: async () => {
            const { data } = await getAllPetsAdmin();
            return data ?? [];
        },
    });
    return (
        <Stack className="w-full h-screen gap-8 p-16 light:bg-gray-50">
            <Title>Pets</Title>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <PetTable role={session.user.role} />
            </HydrationBoundary>
        </Stack>
    );
}
