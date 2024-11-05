import React, { useState } from 'react';
import { bootcamps } from '../data/bootcamps';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Bootcamp = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  duration: string;
  schedule: string;
  coach: string;
  seatsAvailable: number;
  registrations: number; 
};

// Initial list of bootcamps
const initialBootcamps: Bootcamp[] = [
  { id: 1, name: "Full-Stack Developer", description: "Become a full-stack web developer.", startDate: "2024-01-15", duration: "12 Weeks", schedule: "Mon-Fri, 9am-1pm", coach: "John Doe", seatsAvailable: 20, registrations: 15 },
  { id: 2, name: "Data Science & AI", description: "Master machine learning and AI.", startDate: "2024-02-01", duration: "14 Weeks", schedule: "Mon-Fri, 1pm-5pm", coach: "Alice Smith", seatsAvailable: 25, registrations: 20 },
  
];

const AdminDashboard = () => {
  const { register, handleSubmit, reset } = useForm<Bootcamp>();
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>(initialBootcamps);
  const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);

  // Handle create and update operations
  const onSubmit = (data: Bootcamp) => {
    if (editingBootcamp) {
      // Update
      setBootcamps(prevBootcamps =>
        prevBootcamps.map(bootcamp => (bootcamp.id === editingBootcamp.id ? { ...data, id: bootcamp.id } : bootcamp))
      );
      setEditingBootcamp(null);
    } else {
      // Create
      setBootcamps([...bootcamps, { ...data, id: bootcamps.length + 1, registrations: 0 }]);
    }
    reset();
  };

  // Handle delete operation
  const deleteBootcamp = (id: number) => {
    setBootcamps(bootcamps.filter(bootcamp => bootcamp.id !== id));
  };

  // Handle edit operation
  const editBootcamp = (bootcamp: Bootcamp) => {
    setEditingBootcamp(bootcamp);
    reset(bootcamp);
  };

  // Chart data for registrations
  const chartData = {
    labels: bootcamps.map(b => b.name),
    datasets: [
      {
        label: 'Registrations',
        data: bootcamps.map(b => b.registrations),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div className="p-8 bg-darkBg min-h-screen text-white">
      <h1 className="text-4xl font-bold text-primary mb-6">Admin Dashboard</h1>

      {/* Form for creating/updating bootcamps */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <input {...register("name", { required: true })} placeholder="Bootcamp Name" className="w-full p-2 rounded-lg bg-gray-700" />
        <input {...register("description", { required: true })} placeholder="Description" className="w-full p-2 rounded-lg bg-gray-700" />
        <input {...register("startDate", { required: true })} type="date" placeholder="Start Date" className="w-full p-2 rounded-lg bg-gray-700" />
        <input {...register("duration", { required: true })} placeholder="Duration" className="w-full p-2 rounded-lg bg-gray-700" />
        <input {...register("schedule", { required: true })} placeholder="Schedule" className="w-full p-2 rounded-lg bg-gray-700" />
        <input {...register("coach", { required: true })} placeholder="Coach" className="w-full p-2 rounded-lg bg-gray-700" />
        <input {...register("seatsAvailable", { required: true })} type="number" placeholder="Seats Available" className="w-full p-2 rounded-lg bg-gray-700" />

        <button type="submit" className="bg-primary p-2 rounded-lg text-white w-full">
          {editingBootcamp ? "Update Bootcamp" : "Create Bootcamp"}
        </button>
      </form>

      {/* Bootcamp list with edit and delete options */}
      <h2 className="text-2xl font-semibold text-primary mb-4">Bootcamps</h2>
      <table className="w-full text-left mb-8">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Start Date</th>
            <th className="py-2">Duration</th>
            <th className="py-2">Coach</th>
            <th className="py-2">Seats Available</th>
            <th className="py-2">Registrations</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bootcamps.map(bootcamp => (
            <tr key={bootcamp.id}>
              <td className="py-2">{bootcamp.name}</td>
              <td className="py-2">{bootcamp.startDate}</td>
              <td className="py-2">{bootcamp.duration}</td>
              <td className="py-2">{bootcamp.coach}</td>
              <td className="py-2">{bootcamp.seatsAvailable}</td>
              <td className="py-2">{bootcamp.registrations}</td>
              <td className="py-2">
                <button onClick={() => editBootcamp(bootcamp)} className="mr-2 bg-blue-600 p-1 rounded">Edit</button>
                <button onClick={() => deleteBootcamp(bootcamp.id)} className="bg-red-600 p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart for bootcamp registrations */}
      <h2 className="text-2xl font-semibold text-primary mb-4">Registration Statistics</h2>
      <div className="w-full md:w-1/2">
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default AdminDashboard;
