
export default  SessionCard = ({
  session,
  actionLabel,
  onAction,
  onView,
  loadingJoin,
  loadingView,
}) => {
  const statusColor = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    closed: "bg-red-100 text-red-800",
  };

  return (
    <div className="border border-gray-200 p-5 rounded-xl shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 group">
      <div>
        <h3 className="font-bold text-[16px] sm:text-lg text-[#001489] mb-2">
          {session.name}
        </h3>
        <p className="text-sm text-gray-500 mb-1">
          Categories:{" "}
          <span className="font-medium">{session.categories?.join(", ")}</span>
        </p>
        <p className="text-sm text-gray-500 mb-1">
          Difficulty:{" "}
          <span className="font-medium">
            {session.difficulties?.join(", ")}
          </span>
        </p>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            statusColor[session.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {session.status.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {actionLabel && (
          <button
            onClick={onAction}
            disabled={loadingJoin}
            className="flex-1 bg-[#001489] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0022cc] transition-colors duration-200 disabled:opacity-50"
          >
            {loadingJoin ? "Processing..." : actionLabel}
          </button>
        )}
        <button
          onClick={onView}
          disabled={loadingView}
          className="flex-1 border border-[#001489] text-[#001489] px-4 py-2 rounded-lg font-medium hover:bg-[#001489] hover:text-white transition-colors duration-200 disabled:opacity-50"
        >
          {loadingView ? "Loading..." : "View"}
        </button>
        <button
          onClick={() =>
            navigate(`/quiz/${session.id}`, {
              state: { sessionId: session.id },
            })
          }
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          Fetch Quiz
        </button>
      </div>

      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-400">
        Participants: {session.participants?.length || 0} | Answers:{" "}
        {session.answers || 0}
      </div>
    </div>
  );
};