import { auth } from "@/auth";
import ServicesTable from "@/components/admin/ServicesTable";
import { getServices } from "@/lib/db/services";
import { Stack, Title } from "@mantine/core";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

export default async function Page() {
    const session = await auth();
    if (session?.user.role !== "admin") unauthorized();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["services"],
        queryFn: getServices,
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Stack bg={"gray.0"} className="w-full h-screen  p-8 ">
                <Title> Services</Title>
                <ServicesTable />
            </Stack>
        </HydrationBoundary>
    );
}
