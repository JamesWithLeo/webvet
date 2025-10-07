import GoogleButton from "@/components/GoogleButton";
import { Input } from "@/components/ui/input";

export default function Signup() {
    return (
        <div className="items-center flex flex-col py-8 px-16 ">
            <div className="flex gap-2 flex-col">
                <h1>Signup</h1>
                <Input />
                <Input />
                <GoogleButton />
            </div>
        </div>
    );
}
