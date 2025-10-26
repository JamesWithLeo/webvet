import { Session } from "next-auth";
import { RedirectType, redirect } from "next/navigation";

const checkSetup = (session: Session | null) => {
    if (
        session &&
        session.user.id &&
        (!session.user.firstName ||
            !session.user.lastName ||
            !session.user.sex ||
            !session.user.dateOfBirth)
    ) {
        redirect("/v1/auth/setup", RedirectType.replace);
    }
};

export default checkSetup;
