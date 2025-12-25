import VerifyAccountButton from "@/components/VerifyAccountButton";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const email = typeof params.email === "string" ? params.email : "";
    const token = typeof params.token === "string" ? params.token : "";

    return (
        <div>
            <h1>Verify Here</h1>
            <VerifyAccountButton email={email} token={token} />
        </div>
    );
}
