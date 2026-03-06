import { auth } from "@/auth";
import AuthForm from "@/components/auth/AuthForm";
import GoogleButton from "@/components/common/GoogleButton";
import Logo from "@/components/common/Logo";
import { Box } from "@mantine/core";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await auth();
    if (session?.user?.id && !session.error) {
        redirect("/");
    }

    return (
        <div className="justify-center items-center px-4 sm:px-8  bg-[url('/bgPattern.svg')]  min-h-dvh flex ">
            <section className="h-screen flex-col items-center justify-center flex w-full  max-w-7xl bg-white">
                <Box
                    color="primary"
                    className=" w-full flex mb-16 justify-center"
                >
                    <Logo />
                </Box>
                <div className="flex gap-3.5 max-w-sm w-full flex-col ">
                    <h1 className="md:text-4xl text-2xl font-bold mb-6">
                        Welcome Back!
                    </h1>

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
