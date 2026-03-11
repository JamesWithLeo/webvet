import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
    const session = await auth();
    if (session?.user.role === "vet") {
        redirect("clinic/treatment-board");
    }
    if (session?.user.role === "staff") {
        redirect("clinic/appointments");
    }
    redirect("clinic/dashboard");
}
