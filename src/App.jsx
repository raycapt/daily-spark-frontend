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
  const [form, setForm] = useState({
    id: "",
    user_id: "child1",
    name: "",
    description: "",
    points: 1,
    required: true,
    type: "yesno",
    days_active: [],
  });

  const childOptions = ["child1", "child2", "child3"];
  const generateId = () => `task-${Date.now()}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "days_active") {
      const updated = form.days_active.includes(value)
        ? form.days_active.filter((d) => d !== value)
        : [...form.days_active, value];
      setForm({ ...form, days_active: updated });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = { ...form, id: generateId() };

    fetch("https://daily-spark-backend.onrender.com/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => alert("Task added successfully!"))
      .catch(() => alert("Failed to add task"));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assign a New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          name="user_id"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={form.user_id}
        >
          {childOptions.map((child) => (
            <option key={child} value={child}>
              {child}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="name"
          placeholder="Task Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        ></textarea>

        <input
          type="number"
          name="points"
          placeholder="Points"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={form.points}
        />

        <select
          name="type"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          value={form.type}
        >
          <option value="yesno">Yes/No</option>
          <option value="mcq">Multiple Choice</option>
          <option value="photo">Photo Upload</option>
        </select>

        <label className="block">
          <input
            type="checkbox"
            name="required"
            onChange={handleChange}
            checked={form.required}
          />{" "}
          Required?
        </label>

        <div>
          <p className="font-semibold">Days Active:</p>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <label key={day} className="mr-2">
              <input
                type="checkbox"
                name="days_active"
                value={day}
                onChange={handleChange}
              />{" "}
              {day}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Task
        </button>
      </form>
    </div>
  );
}

function ChildDashboard() {
  const [selectedChild, setSelectedChild] = useState("child1");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = (childId) => {
    fetch(`https://daily-spark-backend.onrender.com/tasks/${childId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks(selectedChild);
  }, [selectedChild]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>

      <label className="block mb-4">
        Select Child:
        <select
          className="w-full border p-2 mt-1 rounded"
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
        >
          <option value="child1">Child 1</option>
          <option value="child2">Child 2</option>
          <option value="child3">Child 3</option>
        </select>
      </label>

      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
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
