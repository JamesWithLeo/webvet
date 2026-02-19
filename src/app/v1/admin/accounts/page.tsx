import AccountTable from "@/components/admin/AccountTable";
import { Title, Stack } from "@mantine/core";

export default function Users() {
    return (
        <Stack className="w-full h-screen gap-4 p-16 light:bg-gray-50">
            <Title>Account</Title>
            <AccountTable />
            {/* <UserPanel /> */}
        </Stack>
    );
}
