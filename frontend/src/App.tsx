import { useEffect, useState } from "react";
import "./App.css";
import { Client, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67e9d1c10001b5c3836e");

const databases = new Databases(client);
const DATABASE_ID = "your_database_id"; // Replace with your actual database ID
const COLLECTION_ID = "your_collection_id"; // Replace with your actual collection ID

function App() {
  const [data, setData] = useState(null);
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", {
        exercise,
        sets: parseInt(sets),
        reps: parseInt(reps),
        date,
      });
      alert("Exercise logged successfully!");
      setExercise("");
      setSets("");
      setReps("");
      setDate("");
    } catch (error) {
      console.error("Error logging exercise:", error);
      alert("Failed to log exercise.");
    }
  };

  return (
    <div>
      <header className="header">
        <h1 className="title">Workout Logger</h1>
      </header>
      <h1>{data ? data : "Loading..."}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exercise Name"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Log Exercise</button>
      </form>
    </div>
  );
}

export default App;
