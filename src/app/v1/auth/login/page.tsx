import { authOptions } from "@/authOptions";
import GoogleButton from "@/components/GoogleButton";
import Logo from "@/components/Logo";
import { Button, TextInput } from "@mantine/core";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);
    if (session?.user.id) redirect("/");

    return (
        <div className="items-center  grid grid-cols-[1fr]  bg-[url('/pattern.svg')] grid-rows-1 min-h-dvh px-32 ">
            <section className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-white">
                <div className=" w-full flex mb-16 justify-center">
                    <Logo />
                </div>
                <div className="flex gap-3.5 w-sm flex-col ">
                    <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
                    <TextInput
                        label="Email"
                        placeholder="juantamad@gmail.com"
                    />
                    <Button color="#043343" className="w-full">
                        Login
                    </Button>

                    <GoogleButton />

                    <span className="w-full flex justify-center gap-4">
                        <h1 className="text-center ">
                            Doesn’t have an account?
                        </h1>
                        <Link
                            href={"/v1/auth/signup"}
                            className="underline-offset-2 underline"
                        >
                            Sign up
                        </Link>
                    </span>
                </div>
            </section>
        </div>
    );
}
