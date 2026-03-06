import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
    const session = await auth();
    if (session?.user.role === "vet") {
        redirect("admin/treatment-board");
    }
    if (session?.user.role === "staff") {
        redirect("admin/appointments");
    }
    redirect("admin/dashboard");
}
