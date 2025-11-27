import React from 'react'

const RoundA = () => {
  return (
    <div>
       <p className="font-semibold text-center text-2xl  mb-2">Round 32</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {matches.map((match, idx) => (
          <div
            key={idx}
            className="border border-[#001489] rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Date & Status */}
            <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
              <p className="text-gray-500">{match.time}</p>
              <p
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  match.status === "Live"
                    ? "border border-[#001489] text-[#001489]"
                    : "bg-[#001489] text-white"
                }`}
              >
                {match.status}
              </p>
            </div>

            {/* Team 1 */}
            <div className="flex justify-between items-center mb-2">
              <span className="inline-flex items-center space-x-2">
                <img src={schoollogo} alt="School Logo" className="w-8 h-8 rounded" />
                <span className="font-semibold text-base sm:text-lg">{match.team1}</span>
              </span>
              <p className="font-semibold">{match.score1}</p>
            </div>

            {/* Vs */}
            <p className="text-center font-semibold my-2 text-gray-700">Vs</p>

            {/* Team 2 */}
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center space-x-2">
                <img src={schoollogo} alt="School Logo" className="w-8 h-8 rounded" />
                <span className="font-semibold text-base sm:text-lg">{match.team2}</span>
              </span>
              <p className="font-semibold">{match.score2}</p>
            </div>

          </div>
        ))}
      </div> 
    </div>
  )
}

export default RoundA
