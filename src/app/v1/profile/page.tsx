import { redirect } from "next/navigation";
import { Paper } from "@mantine/core";
import ProfileCardGroup from "@/components/common/ProfileCardGroup";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ProfileStats from "@/components/user/ProfileStats";
import ProfileAction from "@/components/user/ProfileAction";

export default async function ProfilePage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/");
    }

    return (
        <SessionProvider>
            <div className="flex items-center h-screen  flex-col">
                <div className="w-full max-w-7xl gap-8 flex flex-col">
                    <Paper
                        withBorder
                        radius="md"
                        shadow="xs"
                        p={"xl"}
                        w={"100%"}
                        className="relative "
                    >
                        <ProfileCardGroup
                            id={session.user.id}
                            firstName={session.user.firstName}
                            lastName={session.user.lastName}
                            dateOfBirth={session.user.dateOfBirth}
                            photoUrl={session.user.photoUrl}
                            email={session.user.email}
                            gender={session.user.gender}
                        />
                    </Paper>
                    <ProfileStats id={session.user.id} />
                    <ProfileAction />
                </div>
            </div>
        </SessionProvider>
    );
}
