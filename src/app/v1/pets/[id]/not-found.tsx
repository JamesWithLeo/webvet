import NotFoundComponent from "@/components/common/Notfound";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full items-center md:px-16 p-8 flex gap-8 flex-col">
            <div className="w-full h-full max-w-7xl items-center gap-8 flex flex-col">
                <NotFoundComponent
                    backTo="Go back to pets page."
                    link="/v1/pets"
                />
            </div>
        </div>
    );
}
