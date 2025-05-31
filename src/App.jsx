import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  return (
    <div className="text-center p-8">
      <h1 className="text-3xl font-bold">Welcome to DailySpark</h1>
      <p className="mt-4">Who are you?</p>
      <div className="mt-6 flex justify-center gap-4">
        <Link to="/parent" className="bg-blue-500 text-white px-4 py-2 rounded-xl">I'm a Parent</Link>
        <Link to="/child" className="bg-green-500 text-white px-4 py-2 rounded-xl">I'm a Child</Link>
      </div>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Parent Dashboard</h2>
      <p className="mt-2">(Coming soon: Add child, assign tasks, view reports)</p>
    </div>
  );
}

function ChildDashboard() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch("https://daily-spark-backend.onrender.com/tasks/child1")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Today's Tasks</h2>
      <ul className="mt-4 space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="border p-2 rounded-xl">
            <strong>{task.name}</strong> – {task.points} pts
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/child" element={<ChildDashboard />} />
      </Routes>
    </Router>
  );
}
