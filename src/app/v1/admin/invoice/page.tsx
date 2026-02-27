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
        <Stack className="w-full h-screen gap-4 p-16 light:bg-gray-50">
            <Title>Invoice</Title>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminInvoiceTable />
            </HydrationBoundary>
        </Stack>
    );
}
