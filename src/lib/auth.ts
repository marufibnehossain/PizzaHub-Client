import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";
import { APIError } from "better-auth/api";

const client = new MongoClient(process.env.MONGODB_URI!);

const db = client.db("pizzahub");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    baseURL: process.env.BETTER_AUTH_URL,

    trustedOrigins: [process.env.BETTER_AUTH_URL!],

    secret: process.env.BETTER_AUTH_SECRET,

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },

        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "customer",
                input: false,
            },
            businessName: {
                type: "string",
                required: false,
                input: false,
            },

            subscriptionPlan: {
                type: "string",
                required: false,
                input: false,
            },

            subscriptionExpiresAt: {
                type: "date",
                required: false,
                input: false,
            },

            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        },
    },

    databaseHooks: {
        user: {
            create: {
            before: async (user, ctx) => {
                let role = "customer";

                if (ctx?.path === "/sign-up/email") {
                const selectedRole = ctx.body?.registrationRole;

                if (
                    selectedRole !== undefined &&
                    selectedRole !== "customer" &&
                    selectedRole !== "vendor"
                ) {
                    throw new APIError("BAD_REQUEST", {
                    message: "Invalid registration role.",
                    });
                }

                if (selectedRole === "vendor") {
                    role = "vendor";
                }
                }

                return {
                data: {
                    ...user,
                    role,
                    isBlocked: false,

                    ...(role === "vendor"
                    ? {
                        subscriptionPlan: "free",
                        }
                    : {}),
                },
                };
            },
            },
        },
    },

    plugins: [jwt()],
});