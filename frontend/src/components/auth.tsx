import { Client, Account } from "appwrite";

// Initialize the Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67e9d1c10001b5c3836e"); // Use your actual Appwrite endpoint and project ID
const account = new Account(client);

// Sign up new user
export const signup = async (email: string, password: string) => {
  try {
    const response = await account.create("unique()", email, password);
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Login existing user
export const login = async (email: string, password: string) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    console.log("Login successful:", response); // Log the response for debugging
    return response;
  } catch (error) {
    console.error("Error logging in:", error); // Log error for better debugging
    throw new Error("Login failed"); // Throw error to be caught in the Login component
  }
};

// Logout the user
export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
