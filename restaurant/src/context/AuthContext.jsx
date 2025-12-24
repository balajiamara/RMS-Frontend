import { createContext } from "react";

// The context object is created here and exported.
// It will be imported by the Provider and any consumer components (via `useContext`).
export const AuthContext = createContext();