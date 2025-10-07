import { authOptions } from "@/authOptions";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/");
    }
    return (
        <div className="flex items-center flex-col py-8 px-16">
            <h1>Dashboard</h1>
            <h1>{session.user.name}</h1>

            <Button asChild variant={"link"}>
                <Link href={"/v1/appointment"}>Appointment</Link>
            </Button>
            <Button asChild variant={"link"}>
                <Link href={"/v1/payment"}>Payment</Link>
            </Button>
            <LogoutButton />
        </div>
    );
}
