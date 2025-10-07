
import { authOptions } from "@/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function AppPage() {
  const session = await getServerSession(authOptions)
  if (session?.user) {
    redirect("/v1/dashboard")
  } 

  return (
    <div className="items-center flex flex-col py-8 px-16 ">
      <div className="gap-4 flex">
        <Link href={"/v1/signup"}>Sign in </Link>
      </div>
    </div>
  )
}