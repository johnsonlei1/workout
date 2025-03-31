import { useEffect, useState } from "react";
import "./App.css";
import { Client, Databases, ID } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("67e9d1c10001b5c3836e");

const databases = new Databases(client);
const DATABASE_ID = "67e9d7e00002b31a049d"; // Replace with your actual database ID
const COLLECTION_ID = "67e9d95e001c3e26c317"; // Replace with your actual collection ID

const promise = databases.createDocument(
  DATABASE_ID,
  COLLECTION_ID,
  ID.unique(),
  { name: "chest" }
);

function App() {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
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
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        date,
      });
      alert("name logged successfully!");
      setName("");
      setSets("");
      setReps("");
      setDate("");
    } catch (error) {
      console.error("Error logging name:", error);
      alert("Failed to log name.");
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
          placeholder="name Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <button type="submit">Log name</button>
      </form>
    </div>
  );
}

export default App;
