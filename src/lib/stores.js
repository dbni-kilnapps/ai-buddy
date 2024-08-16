import { writable } from "svelte/store";

/**
 * Stores for the app
 * example of history: { role: "role", content: "content" }
 * 
 * @type {import("svelte/store").Writable<Array<import("ollama").Message>>}
 */
export const chatHistory = writable([]); // history for a chat room