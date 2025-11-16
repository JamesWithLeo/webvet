import PetCard from "@/components/PetCard";
import PetControllers from "@/components/PetControllers";
import { ActionIcon, Center, Paper } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

const myPets: {
    gender: "Male" | "Female";
    name: string;
    heart: boolean;
    breed: string;
    imageUrl: string;
    age: number;
}[] = [
    {
        name: "Ara",
        heart: true,
        breed: "Golden Retriever",
        gender: "Female",
        imageUrl: "/goldenr.jpg",
        age: 8,
    },
    {
        name: "Howl",
        heart: false,
        gender: "Male",
        breed: "Dachshund",
        imageUrl: "/dachshund.jpg",
        age: 3,
    },
    {
        name: "Thunder",
        heart: false,
        gender: "Male",
        breed: "Aspin",
        imageUrl: "",
        age: 5,
    },
    {
        name: "Kirby",
        heart: false,
        gender: "Female",
        breed: "Persian",
        imageUrl: "/persian.jpg",
        age: 2,
    },
];
export default function Page() {
    return (
        <div className="flex  items-center gap-8 w-full h-screen  flex-col   ">
            <div className="min-h-screen w-full relative md:px-16 px-4 py-4 flex gap-8 flex-col">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 0",
                        maskImage: `
         repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                        WebkitMaskImage: `
  repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
      `,
                        maskComposite: "intersect",
                        WebkitMaskComposite: "source-in",
                    }}
                />
                <PetControllers />
                <section className="flex gap-4 w-full justify-center flex-wrap">
                    {myPets.map((p, index) => (
                        <PetCard
                            key={`${p.name}_${index}`}
                            name={p.name}
                            heart={p.heart}
                            breed={p.breed}
                            gender={p.gender}
                            imageUrl={p.imageUrl}
                            age={p.age}
                        />
                    ))}
                    <Paper
                        withBorder
                        bg={"white"}
                        className=" z-10 w-96 group flex items-center flex-col justify-center h-[500px]"
                        p={{ base: "sm", lg: "lg" }}
                    >
                        <Center className="h-full">
                            <ActionIcon
                                className="group-hover:scale-[1.04]"
                                size={"xl"}
                                radius={"xl"}
                                variant="gradient"
                            >
                                <IconPlus size={20} stroke={1.5} />
                            </ActionIcon>
                        </Center>
                    </Paper>
                </section>
            </div>
        </div>
    );
}
