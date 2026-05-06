export default function StatCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center">
        <div>{icon}</div>
        <span className={`text-xl font-bold ${color}`}>
          {value}
        </span>
      </div>
      <h3 className="mt-2 text-gray-700">{title}</h3>
    </div>
  );
}