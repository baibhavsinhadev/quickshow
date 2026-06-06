import User from "../models/User.js";
import { inngest } from "./client.js";

// Inngest Functions to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk", triggers: [{ event: "clerk/user.created" }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const fullName = first_name + " " + (last_name || "");

        const userData = {
            _id: id,
            email: email_addresses?.[0]?.email_address || "",
            name: fullName,
            image: image_url
        };

        await User.create(userData);
    }
);

// Inngest Functions to update user data
const syncUserUpdate = inngest.createFunction(
    { id: "update-user-from-clerk", triggers: [{ event: "clerk/user.updated" }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const fullName = first_name + " " + (last_name || "");
        
        const updatedData = {
            email: email_addresses?.[0]?.email_address || "",
            name: fullName,
            image: image_url,
        };
        
        await User.findByIdAndUpdate(id, updatedData, { upsert: true });
    }
);

// Inngest Functions to delete user data
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

export const functions = [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion
];