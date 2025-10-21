import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/");
    }

    return (
        <div>
            <h1>First name: {session.user.firstName} </h1>
            <h1>Last name: {session.user.lastName} </h1>
            <h1>Sex: {session.user.sex}</h1>
            <h1>Date of Birth: {session.user.dateOfBirth} </h1>
            <LogoutButton />
        </div>
    );
}
