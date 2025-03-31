import React, { useState, useEffect } from "react";
import { Databases, Client } from "appwrite";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

// Initialize the Appwrite client
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    reps: "",
    sets: ""
  });
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.reps || !formData.sets) {
      return;
    }

    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        "unique()",
        { 
          name: formData.name, 
          reps: parseInt(formData.reps), 
          sets: parseInt(formData.sets),
          date: new Date().toISOString() 
        }
      );
      setWorkouts([...workouts, response]);
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
    navigate("/login"); // Redirect to login after logout
  };

  // Group workouts by date
  const groupWorkoutsByDate = () => {
    const grouped: { [date: string]: any[] } = {};
    
    // Sort workouts by date (most recent first)
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Group by date
    sortedWorkouts.forEach(workout => {
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
    <div>
      <header className="header">
        <h1 className="title">Dashboard</h1>
        <button 
          style={{ 
            fontSize: "12px", 
            padding: "4px 8px", 
            position: "absolute", 
            top: "20px", 
            right: "50px", 
            color: "white" 
          }} 
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      
      {error && <div style={{ color: "red" }}>{error}</div>}
      
      <section>
        <h2>Your Workouts</h2>
        {workouts.length === 0 ? ( // No workouts found
          <p>No workouts logged yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {Object.entries(groupedWorkouts).map(([date, dateWorkouts]) => (
              <div key={date} style={{ marginBottom: "20px" }}>
                <h3 style={{ marginBottom: "10px" }}>{date}</h3>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse", 
                  marginBottom: "10px",
                  backgroundColor: "#222"
                }}>
                  <thead>
                    <tr>
                      <th style={{ 
                        padding: "8px", 
                        textAlign: "left", 
                        borderBottom: "1px solid #444",
                        backgroundColor: "#333"
                      }}>Exercise</th>
                      <th style={{ 
                        padding: "8px", 
                        textAlign: "center", 
                        borderBottom: "1px solid #444",
                        backgroundColor: "#333"
                      }}>Reps</th>
                      <th style={{ 
                        padding: "8px", 
                        textAlign: "center", 
                        borderBottom: "1px solid #444",
                        backgroundColor: "#333"
                      }}>Sets</th>
                      <th style={{ 
                        padding: "8px", 
                        textAlign: "center", 
                        borderBottom: "1px solid #444",
                        backgroundColor: "#333"
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateWorkouts.map((workout) => (
                      <tr key={workout.$id}>
                        <td style={{ 
                          padding: "8px", 
                          borderBottom: "1px solid #444"
                        }}>
                          <strong>{workout.name}</strong>
                        </td>
                        <td style={{ 
                          padding: "8px", 
                          textAlign: "center", 
                          borderBottom: "1px solid #444"
                        }}>
                          {workout.reps}
                        </td>
                        <td style={{ 
                          padding: "8px", 
                          textAlign: "center", 
                          borderBottom: "1px solid #444"
                        }}>
                          {workout.sets}
                        </td>
                        <td style={{ 
                          padding: "8px", 
                          textAlign: "center", 
                          borderBottom: "1px solid #444"
                        }}>
                          <button 
                            style={{ 
                              fontSize: "12px", 
                              padding: "4px 8px", 
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }} 
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

      <button 
        style={{ 
          fontSize: "14px", 
          padding: "8px 16px", 
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px"
        }} 
        onClick={() => setShowAddForm(true)}
      >
        Add New Exercise
      </button>

      {/* Modal Popup for Adding Exercise */}
      {showAddForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#333",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            maxWidth: "90%"
          }}>
            <h3>Add New Exercise</h3>
            <form onSubmit={handleAddWorkout}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Exercise Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ 
                    width: "90%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc",
                    backgroundColor: "#818181",
                    color: "white"
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Number of Reps:
                </label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleInputChange}
                  style={{ 
                    width: "90%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc",
                    backgroundColor: "#818181"
                  }}
                  min="1"
                  required
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Number of Sets:
                </label>
                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleInputChange}
                  style={{ 
                    width: "90%", 
                    padding: "8px", 
                    borderRadius: "4px", 
                    border: "1px solid #ccc",
                    backgroundColor: "#818181"
                  }}
                  min="1"
                  required
                />
              </div>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{ 
                    alignItems: "center",
                    padding: "8px 16px", 
                    backgroundColor: "red",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ 
                    alignItems: "center",
                    padding: "8px 16px", 
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
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