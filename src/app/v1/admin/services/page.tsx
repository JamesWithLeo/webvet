import { auth } from "@/auth";
import ServicesTable from "@/components/admin/ServicesTable";
import { getServices } from "@/lib/db/services";
import { Title } from "@mantine/core";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { unauthorized } from "next/navigation";

export default async function Page() {
    // only the admin
    const session = await auth();
    if (session?.user.role !== "admin") unauthorized();

    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["services"],
        queryFn: getServices,
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="w-full h-screen sm:p-16 p-4 ">
                <Title order={2} c={"dimmed"}>
                    #Services
                </Title>
                <ServicesTable />
            </div>
        </HydrationBoundary>
    );
}
