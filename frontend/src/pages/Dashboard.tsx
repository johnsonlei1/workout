import React, { useState, useEffect } from "react";
import { Databases, Client } from "appwrite";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

//Initialize the Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67e9d1c10001b5c3836e"); // Replace with your actual Appwrite project ID

const databases = new Databases(client);
const DATABASE_ID = "67e9d7e00002b31a049d"; // Replace with your actual database ID
const COLLECTION_ID = "67e9d95e001c3e26c317"; // Replace with your actual collection ID

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<any[]>([]); // Store the list of workouts
  const [error, setError] = useState<string | null>(null); // For error handling
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the data from the database
    const fetchWorkouts = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );
        setWorkouts(response.documents); // Store the documents in state
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to load workouts.");
      }
    };

    fetchWorkouts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Dashboard</h1>
      </header>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <section>
        <h2>Workouts</h2>
        {workouts.length === 0 ? (
          <p>No workouts logged yet.</p>
        ) : (
          <ul>
            {workouts.map((workout) => (
              <li key={workout.$id}>
                <strong>{workout.name}</strong> | Date: {new Date(workout.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
