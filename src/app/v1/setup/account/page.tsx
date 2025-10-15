import AccountStepper from "@/components/AccountStepper";
import { Box, Button, Stepper, TextInput } from "@mantine/core";

export default function SetupAccount() {
    return (
        <div className="py-8 px-32 bg-gray-100 min-h-screen items-center      flex-col flex justify-center">
            <Box className="bg-white px-8 h-full py-16  gap-10 flex flex-col max-w-xl w-full  rounded-2xl shadow">
                <AccountStepper stepTwo={<h1>Hello</h1>} />
            </Box>
        </div>
    );
}
