import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@mantine/core";

export default async function UserAvatar({
    photoUrl,
}: {
    photoUrl?: string | null;
}) {
    return (
        <>
            {photoUrl ? (
                <Link
                    href={"/v1/profile"}
                    className="relative lg:h-10 lg:w-10 min-h-8 min-w-8 select-none cursor-pointer bg-gray-200 rounded-full shadow"
                >
                    <Image
                        fill={true}
                        src={photoUrl}
                        className="rounded-full p-0.5 relative object-cover aspect-square"
                        alt="Avatar"
                    />
                </Link>
            ) : (
                <Link href={"/v1/auth/signup"}>
                    <Avatar radius={"xl"} />
                </Link>
            )}
        </>
    );
}
