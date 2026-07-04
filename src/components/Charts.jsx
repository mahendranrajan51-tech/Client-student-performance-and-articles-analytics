import { Bar, Line, Pie } from "react-chartjs-2";

const palette = ["#2563eb", "#16a34a", "#f97316", "#db2777", "#0891b2", "#7c3aed"];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } }
};

export const BarChart = ({ labels, values, label }) => (
  <div className="chart-box">
    <Bar options={chartOptions} data={{ labels, datasets: [{ label, data: values, backgroundColor: "#2563eb" }] }} />
  </div>
);

export const PieChart = ({ labels, values, label }) => (
  <div className="chart-box">
    <Pie options={chartOptions} data={{ labels, datasets: [{ label, data: values, backgroundColor: palette }] }} />
  </div>
);

export const LineChart = ({ labels, values, label }) => (
  <div className="chart-box">
    <Line options={chartOptions} data={{ labels, datasets: [{ label, data: values, borderColor: "#16a34a", backgroundColor: "#16a34a", tension: 0.35 }] }} />
  </div>
);
