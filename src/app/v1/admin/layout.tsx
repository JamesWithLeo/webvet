import AdminNav from "@/components/AdminNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main
                className="flex min-h-dvh w-full overflow-y-hidden"
                suppressHydrationWarning
            >
                <AdminNav />
                {children}
            </main>
        </>
    );
}
