import { ReactNode } from "react";
import Providers from "../../Provider";

export default function Layout({ children }: { children: ReactNode }) {
    return <Providers>{children}</Providers>;
}
