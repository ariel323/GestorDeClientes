import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function ClientAnalytics({ clients }) {
  // Análisis por etiquetas
  const tagStats = clients.reduce((acc, client) => {
    client.tags?.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const tagData = Object.entries(tagStats).map(([name, value]) => ({
    name,
    value,
  }));

  // Análisis por ubicación
  const locationStats = clients.reduce((acc, client) => {
    const location = client.location || "Sin ubicación";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const locationData = Object.entries(locationStats).map(([name, value]) => ({
    name,
    value,
  }));

  // Análisis mensual
  const monthlyStats = clients.reduce((acc, client) => {
    const date = new Date(client.id); // Usando id como timestamp
    const month = date.toLocaleString("default", { month: "long" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyData = Object.entries(monthlyStats).map(([name, value]) => ({
    name,
    value,
  }));

  // Estadísticas generales
  const generalStats = {
    totalClients: clients.length,
    withEmail: clients.filter((c) => c.email).length,
    withPhone: clients.filter((c) => c.phone).length,
    withCompany: clients.filter((c) => c.company).length,
    withNotes: clients.filter((c) => c.notes?.length > 0).length,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clientes"
          value={generalStats.totalClients}
          description="Clientes registrados"
        />
        <StatCard
          title="Con Email"
          value={`${Math.round(
            (generalStats.withEmail / generalStats.totalClients) * 100
          )}%`}
          description={`${generalStats.withEmail} clientes`}
        />
        <StatCard
          title="Con Teléfono"
          value={`${Math.round(
            (generalStats.withPhone / generalStats.totalClients) * 100
          )}%`}
          description={`${generalStats.withPhone} clientes`}
        />
        <StatCard
          title="Con Notas"
          value={`${Math.round(
            (generalStats.withNotes / generalStats.totalClients) * 100
          )}%`}
          description={`${generalStats.withNotes} clientes`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Distribución por Etiquetas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tagData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {tagData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Clientes por Ubicación</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow col-span-full">
          <h3 className="text-lg font-semibold mb-4">Tendencia Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
