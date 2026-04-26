import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Handles authentication
export const { POST, GET } = toNextJsHandler(auth);