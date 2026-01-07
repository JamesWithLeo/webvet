CREATE TYPE "public"."appointment_type" AS ENUM('CHECK_UP', 'GROOMING', 'VACCINATION', 'CONSULTATION', 'DEWORMING');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('client', 'doctor', 'admin');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"event_datetime" timestamp NOT NULL,
	"type" "appointment_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "breeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pet_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "pet_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"breed_id" integer NOT NULL,
	"age" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "age_check" CHECK ("pets"."age" >= 0 AND "pets"."age" <= 100)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"google_id" varchar(100),
	"role" "role" DEFAULT 'client',
	"first_name" varchar(50),
	"last_name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_pet_type_id_pet_types_id_fk" FOREIGN KEY ("pet_type_id") REFERENCES "public"."pet_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_breed_id_breeds_id_fk" FOREIGN KEY ("breed_id") REFERENCES "public"."breeds"("id") ON DELETE restrict ON UPDATE no action;