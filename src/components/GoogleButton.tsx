"use client"

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"

export default function GoogleButton() {
return  (
<Button onClick={()=> {
    signIn("google" , {callbackUrl: "/v1/dashboard"})
    
}}>
Sign in with Google    
</Button>
    
)
}