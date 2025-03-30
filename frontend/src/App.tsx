import { useEffect, useState } from "react";
import "./App.css";
import { Client } from "appwrite";
const client = new Client();
client.setProject("67e9d1c10001b5c3836e");
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((response) => response.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div>
      <header className="header">
        <h1 className="title">Workout Logger</h1>
      </header>
      <h1>{data ? data : "Loading..."}</h1>
    </div>
  );
}

export default App;
