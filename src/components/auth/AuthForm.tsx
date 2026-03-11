import { signIn } from "@/auth";
import { Button, TextInput } from "@mantine/core";

export default function AuthForm({ label }: { label: string }) {
    return (
        <>
            <form
                className="gap-3.5 flex flex-col"
                action={async (formData) => {
                    "use server";
                    const email = formData.get("email");
                    await signIn("resend", {
                        email,
                        redirectTo: `/v1/auth/verify-request?email=${email}`,
                    });
                }}
            >
                <TextInput label="Email" name="email" type="email" required />
                <Button type="submit" w={"100%"}>
                    {label}
                </Button>
            </form>
        </>
    );
}
