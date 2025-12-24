import { signIn } from "@/auth";
import { Button, TextInput } from "@mantine/core";

export default function SignupForm() {
    return (
        <>
            <form
                className="gap-3.5 flex flex-col"
                action={async (formData) => {
                    "use server";
                    const email = formData.get("email");
                    await signIn("nodemailer", {
                        email,
                        redirectTo: "/dashboard",
                    });
                }}
            >
                <TextInput label="Email" name="email" required />
                <Button type="submit" w={"100%"}>
                    Sign up
                </Button>
            </form>
        </>
    );
}
