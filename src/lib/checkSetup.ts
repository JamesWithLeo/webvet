import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default function checkSetup(session: Session | null) {
    if (!session?.user?.id) return;

    const { firstName, lastName, contactNumber } = session.user;

    if (!firstName || !lastName || !contactNumber) {
        redirect("/v1/auth/setup");
    }
}
