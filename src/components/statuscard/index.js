// src/components/statuscard/index.jsx
const StatusCard = ({ icon, title, count, color }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center gap-4">
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-lg font-bold">{count}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default StatusCard;
