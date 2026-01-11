import { auth } from "@/auth";
import AuthForm from "@/components/auth/AuthForm";
import GoogleButton from "@/components/common/GoogleButton";
import Logo from "@/components/Logo";
import { Box, Button, TextInput } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();
    if (session?.user.id) redirect("/");

    return (
        <div className="items-center  grid grid-cols-[1fr]  bg-[url('/bgPattern.svg')] grid-rows-1 min-h-dvh px-42 ">
            <section className="h-full flex flex-col items-center justify-center  bg-white">
                <Box
                    color="primary"
                    className=" w-full flex mb-16 justify-center"
                >
                    <Logo />
                </Box>
                <div className="flex gap-3.5 w-sm flex-col ">
                    <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>

                    <AuthForm label="Login" />

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
