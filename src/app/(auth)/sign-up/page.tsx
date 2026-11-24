"use client";

import { useState } from "react";
import { authClient } from "../../../lib/auth-client";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setMessage("");

        const { data, error } = await authClient.signUp.email({
            name,
            email,
            password,
        });

        if (error) {
            setMessage(error.message || "Failed to create account.");
            return;
        }

        console.log(data);
        setMessage("Account created successfully!");
    };

    return (
        <main>
            <h1>Create Account</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Create Account
                </button>
            </form>

            {message && <p>{message}</p>}
        </main>
    );
}