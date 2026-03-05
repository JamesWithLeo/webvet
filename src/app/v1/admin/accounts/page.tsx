import AccountTable from "@/components/admin/AccountTable";
import { getAllUsersAdmin } from "@/lib/db/users";
import { Title, Stack } from "@mantine/core";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

export default async function Users() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["user", "admin"],
        queryFn: async () => {
            const { data } = await getAllUsersAdmin();
            return data;
        },
    });
    return (
        <Stack className="w-full h-screen gap-4 p-8" bg={"gray.0"}>
            <Title>Account</Title>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AccountTable />
            </HydrationBoundary>
        </Stack>
    );
}
