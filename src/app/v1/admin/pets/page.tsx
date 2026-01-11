import PetPanels from "@/components/admin/PetPanel";
import PetTable from "@/components/PetTable";
import { Title, Stack, Button, Group } from "@mantine/core";

export default function Pets() {
    return (
        <Stack className="w-full h-screen gap-8 p-16 light:bg-gray-50">
            <Title>Pets</Title>
            <PetTable />
            <PetPanels detailed={true} />
            <Group justify="end">
                <Button variant="default" size="xs">
                    Hide Charts
                </Button>
            </Group>
        </Stack>
    );
}
