"use client";
import { auth } from "@/firebase/client";
import { GoogleAuthProvider, User, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export function getAuthToken(): string | undefined {
    return Cookies.get("firebaseIdToken");
}

export function setAuthToken(token: string): string | undefined {
    return Cookies.set("firebaseIdToken", token, { secure: true, sameSite: "strict" });
}

export function removeAuthToken(): void {
    return Cookies.remove("firebaseIdToken");
}

type AuthContextType = {
    currentUser: User | null;
    isAdmin: boolean;
    isPro: boolean;
    loginGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isPro, setIsPro] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!auth) {
            console.error("Firebase auth not initialized");
            setLoading(false);
            return;
        }

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                setCurrentUser(null);
                setIsAdmin(false);
                setIsPro(false);
                removeAuthToken();
                setLoading(false);
                return;
            }

            try {
                const token = await user.getIdToken();
                setCurrentUser(user);
                setAuthToken(token);

                const tokenValues = await user.getIdTokenResult();
                setIsAdmin(!!tokenValues.claims.admin);
                setIsPro(!!tokenValues.claims.pro);

                // Optionally fetch additional user data
                /*
                const userResponse = await fetch(`/api/users/${user.uid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (userResponse.ok) {
                    const userJson = await userResponse.json();
                    setIsPro(!!userJson.isPro);
                } else {
                    console.error("Could not get user info:", userResponse.status);
                }
                */
            } catch (error: any) {
                console.error("Error in onAuthStateChanged:", error.message, error.code);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    function loginGoogle(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!auth) {
                const error = new Error("Firebase auth not initialized");
                console.error(error.message);
                reject(error);
                return;
            }
            signInWithPopup(auth, new GoogleAuthProvider())
                .then(() => {
                    console.log("Signed in!");
                    resolve();
                })
                .catch((error) => {
                    console.error("Google Sign-In error:", error.message, error.code);
                    reject(error);
                });
        });
    }

    function logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!auth) {
                const error = new Error("Firebase auth not initialized");
                console.error(error.message);
                reject(error);
                return;
            }
            signOut(auth)
                .then(() => {
                    console.log("Signed out");
                    resolve();
                })
                .catch((error) => {
                    console.error("Sign-out error:", error.message, error.code);
                    reject(error);
                });
        });
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAdmin,
                isPro,
                loginGoogle,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};