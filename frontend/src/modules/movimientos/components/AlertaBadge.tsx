export default function AlertaBar({ porcentaje }: { porcentaje: number }) {
  const safe = Math.min(Math.max(porcentaje, 0), 100);

  const color =
    safe <= 30 ? "bg-red-500" :
    safe <= 60 ? "bg-orange-500" :
    "bg-yellow-500";

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-lg h-6 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${safe}%` }}
        >
          <span className="text-xs text-white font-bold">
            {safe}%
          </span>
        </div>
      </div>
    </div>
  );
}