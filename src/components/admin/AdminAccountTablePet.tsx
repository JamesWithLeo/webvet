"use client";

import usePets from "@/lib/hooks/usePets";
import usePetsAdmin from "@/lib/hooks/usePetsAdmin";
import { PetTypeModel, PetTypeModelWithBreed } from "@/types/pets";
import { Stack } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";

type Props = {
    ownerId: string;
};
export default function AdminAccountPetTable({ ownerId }: Props) {
    const { data } = usePets(ownerId, "all");
    const columns = useMemo<DataTableColumn<PetTypeModelWithBreed>[]>(
        () => [{ accessor: "name", title: "Name" }],
        [ownerId, data]
    );
    return (
        <DataTable
            noHeader
            withRowBorders={false}
            withTableBorder={false}
            withColumnBorders={false}
            verticalSpacing="xs"
            horizontalSpacing="xs"
            columns={columns}
            records={data}
        />
    );
}
