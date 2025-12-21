import { signIn } from "@/auth";
import { Button, TextInput } from "@mantine/core";

export default function SignupForm() {
    return (
        <>
            <form
                action={async (formData) => {
                    "use server";
                    const email = formData.get("email");
                    await signIn("resend", { email, redirectTo: "/dashboard" });
                }}
            >
                <TextInput label="Email" name="email" required />
                <Button type="submit">Sign up</Button>
            </form>
        </>
    );
}
