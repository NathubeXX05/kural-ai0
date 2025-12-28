import { users, type User } from "@shared/models/auth";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for auth storage operations
export interface IAuthStorage {
    getUser(id: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(userData: { email: string; passwordHash: string; firstName?: string; lastName?: string }): Promise<User>;
    upsertUser(userData: { id: string; email: string; firstName?: string; lastName?: string }): Promise<User>;
}

class AuthStorage implements IAuthStorage {
    async getUser(id: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
    }

    async createUser(userData: { email: string; passwordHash: string; firstName?: string; lastName?: string }): Promise<User> {
        const [user] = await db
            .insert(users)
            .values({
                email: userData.email,
                passwordHash: userData.passwordHash,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
            })
            .returning();
        return user;
    }

    async upsertUser(userData: { id: string; email: string; firstName?: string; lastName?: string }): Promise<User> {
        const [user] = await db
            .insert(users)
            .values(userData)
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    ...userData,
                    updatedAt: new Date(),
                },
            })
            .returning();
        return user;
    }
}

export const authStorage = new AuthStorage();
