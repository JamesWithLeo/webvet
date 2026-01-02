import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default function checkSetup(session: Session | null) {
    if (!session?.user?.id) return;

    const { firstName, lastName, gender, dateOfBirth } = session.user;

    if (!firstName || !lastName || !gender || !dateOfBirth) {
        redirect("/v1/auth/setup");
    }
}
