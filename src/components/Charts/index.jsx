import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const Charts = ({ data, key, value, color }) => {
  return (
    <BarChart
      width={800}
      height={300}
      data={data}
      margin={{
        top: 15,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={key} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={value} fill={color} width={10} />
    </BarChart>
  );
};
