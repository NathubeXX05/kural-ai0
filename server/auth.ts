import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { authStorage } from "./authStorage";
import bcrypt from "bcryptjs";

export function getSession() {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const pgStore = connectPg(session);
    const sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: false,
        ttl: sessionTtl,
        tableName: "sessions",
    });
    return session({
        secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: sessionTtl,
        },
    });
}

export async function setupAuth(app: Express) {
    app.set("trust proxy", 1);
    app.use(getSession());
    app.use(passport.initialize());
    app.use(passport.session());

    // Local authentication strategy
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    const user = await authStorage.getUserByEmail(email);
                    if (!user) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    const isValidPassword = await bcrypt.compare(password, user.passwordHash || "");
                    if (!isValidPassword) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user: any, cb) => cb(null, user.id));
    passport.deserializeUser(async (id: string, cb) => {
        try {
            const user = await authStorage.getUser(id);
            cb(null, user);
        } catch (error) {
            cb(error);
        }
    });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};

export function registerAuthRoutes(app: Express) {
    // Register endpoint
    app.post("/api/register", async (req, res) => {
        try {
            const { email, password, firstName, lastName } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            // Check if user already exists
            const existingUser = await authStorage.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const user = await authStorage.createUser({
                email,
                passwordHash,
                firstName: firstName || "",
                lastName: lastName || "",
            });

            // Log the user in
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error logging in after registration" });
                }
                res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Login endpoint
    app.post("/api/login", (req, res, next) => {
        passport.authenticate("local", (err: any, user: any, info: any) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            if (!user) {
                return res.status(401).json({ message: info?.message || "Invalid credentials" });
            }
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Error logging in" });
                }
                res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
            });
        })(req, res, next);
    });

    // Logout endpoint
    app.post("/api/logout", (req, res) => {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            res.json({ message: "Logged out successfully" });
        });
    });

    // Get current user endpoint
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const user = req.user as any;
        res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
    });
}
