import AdminInvoiceTable from "@/components/admin/invoice/AdminInvoiceTable";
import { getInvoiceAdmin } from "@/lib/db/invoice";
import { Stack, Title } from "@mantine/core";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

export default async function Page() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({
        queryKey: ["invoices", "admin"],
        queryFn: async () => {
            const invoices = await getInvoiceAdmin();
            return invoices ?? [];
        },
    });
    return (
        <Stack className="w-full h-screen gap-4 p-8 " bg={"gray.0"}>
            <Title>Invoice</Title>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminInvoiceTable />
            </HydrationBoundary>
        </Stack>
    );
}
