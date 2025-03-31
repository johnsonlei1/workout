import React, { useState, useEffect } from "react";
import {
  Databases,
  Client,
  Models,
  ID,
  Account,
  Permission,
  Role,
} from "appwrite";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import "./Dashboard.css";

// Initialize the Appwrite client
const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67e9d1c10001b5c3836e");

const databases = new Databases(client);
const DATABASE_ID = "67e9d7e00002b31a049d";
const COLLECTION_ID = "67e9d95e001c3e26c317";

const account = new Account(client);

const getCurrentUser = async () => {
  try {
    const user = await account.get(); // Get logged-in user info
    return user.$id; // Return the user ID
  } catch (error) {
    console.error("User not authenticated:", error);
    return null; // Return null if the user is not logged in
  }
};

// Extending Appwrite's Document type with our custom fields
interface Workout extends Models.Document {
  name: string;
  reps: number;
  sets: number;
  date: Date;
}

interface FormData {
  name: string;
  reps: string;
  sets: string;
}

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    reps: "",
    sets: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the data from the database
    const fetchWorkouts = async () => {
      const userId = await getCurrentUser();
      if (!userId) {
        console.error("User not authenticated");
        return; // Stop the process if user is not authenticated
      }
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );
        setWorkouts(response.documents as Workout[]);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to load workouts.");
      }
    };
    fetchWorkouts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.reps || !formData.sets) {
      return;
    }
    const userId = await getCurrentUser(); // Get the logged-in user
    if (!userId) {
      console.error("User not authenticated");
      return; // Stop the process if user is not authenticated
    }

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name: formData.name,
          reps: parseInt(formData.reps),
          sets: parseInt(formData.sets),
          date: new Date().toISOString(),
        },
        [
          Permission.read(Role.user(userId)), // Allow the user to read the document
          Permission.write(Role.user(userId)), // Allow the user to write (modify) the document
        ]
      );
      setWorkouts([...workouts, response as unknown as Workout]);
      setFormData({ name: "", reps: "", sets: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding workout:", error);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      setWorkouts(workouts.filter((workout) => workout.$id !== id));
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Group workouts by date
  const groupWorkoutsByDate = () => {
    const grouped: { [date: string]: Workout[] } = {};

    // Sort workouts by date (most recent first)
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Group by date
    sortedWorkouts.forEach((workout) => {
      const dateStr = new Date(workout.date).toLocaleDateString();
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(workout);
    });

    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByDate();

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="title">Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <section className="workouts-section">
        <h2>Your Workouts</h2>
        {workouts.length === 0 ? (
          <p>No workouts logged yet.</p>
        ) : (
          <div className="workouts-container">
            {Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => (
              <div key={date} className="date-group">
                <h3 className="date-header">{date}</h3>
                <table className="workouts-table">
                  <thead>
                    <tr>
                      <th>Exercise</th>
                      <th>Reps</th>
                      <th>Sets</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateWorkouts.map((workout) => (
                      <tr key={workout.$id}>
                        <td>
                          <strong>{workout.name}</strong>
                        </td>
                        <td>{workout.reps}</td>
                        <td>{workout.sets}</td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteWorkout(workout.$id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>

      <button className="add-button" onClick={() => setShowAddForm(true)}>
        Add New Exercise
      </button>

      {/* Modal Popup for Adding Exercise */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Exercise</h3>
            <form onSubmit={handleAddWorkout}>
              <div className="form-group">
                <label>Exercise Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Reps:</label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Sets:</label>
                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
