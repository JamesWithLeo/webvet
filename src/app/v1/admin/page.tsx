import { redirect } from "next/navigation";

export default async function Admin() {
    redirect("admin/dashboard");
}
