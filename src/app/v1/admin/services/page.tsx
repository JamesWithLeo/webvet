import ServicesTable from "@/components/admin/ServicesTable";
import { getServices } from "@/lib/db/services";
import { Title } from "@mantine/core";

export default async function Page() {
    const services = await getServices();
    return (
        <div className="w-full h-screen sm:p-16 p-4 ">
            <Title order={2} c={"dimmed"}>
                #Services
            </Title>
            <ServicesTable records={services} />
        </div>
    );
}
