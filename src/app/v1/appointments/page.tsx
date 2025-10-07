import { Button } from "@/components/ui/button";
import Link from "next/link";
import AppointmentDialog from "./AppointmentDialog";

export default async function AppointmentPage() {
    return (
        <>
            <div className="flex px-16 py-8 flex-col items-start  min-w-dvw   h-full min-h-dvh ">
                <AppointmentDialog />
                <Button asChild variant={"link"}>
                    <Link href={"/"}>Back to Home</Link>
                </Button>
            </div>
        </>
    );
}
