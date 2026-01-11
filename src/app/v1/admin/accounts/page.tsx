import AccountTable from "@/components/admin/AccountTable";
import UserPanel from "@/components/admin/UserPanel";
import { Title, Stack } from "@mantine/core";

export default function Users() {
    return (
        <Stack className="w-full h-screen gap-4 p-16 light:bg-gray-50">
            <Title>Account</Title>
            {/* <Flex direction={"column"} align={"flex-start"} gap={"sm"}>
                <Group>
                    <TextInput label="ID" />
                    <TextInput label="First name" />
                    <TextInput label="Last name" />
                </Group>
                <Group>
                    <Button color={"red.4"} variant="light">
                        Reset
                    </Button>
                    <Button>Search</Button>
                </Group>
            </Flex> */}
            <AccountTable />
            <UserPanel />
        </Stack>
    );
}
