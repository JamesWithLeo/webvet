import { ServicePriceTypeModel } from "@/db/schema/services";
import { useEffect, useState } from "react";

export default function useServiceVariant({ id }: { id: string }) {
    const [isPending, setIsPending] = useState(false);
    const [variants, setVariants] = useState<ServicePriceTypeModel[]>([]);

    useEffect(() => {
        async function fetchData() {
            setIsPending(true);
            const res = await fetch(`/api/service/variant/?id=${id}`);
            const data = await res.json();
            setVariants(data);
            setIsPending(false);
        }
        fetchData();
    }, []);
    return { isPending, variants };
}
