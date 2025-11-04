import { Button } from "@mantine/core";
import Link from "next/link";

export default async function AppointmentPage() {
    return (
        <>
            <div className="flex items-center py-8  flex-col h-screen md:px-16 px-4">
                <Link href={"new/appointment"}>New</Link>
            </div>
        </>
    );
}
