import React from 'react'

const TeamDetails = () => {
return (
<>
    <div className="max-w-4xl px-6 mx-auto">
        <h1 className="text-2xl font-bold">School Registration</h1>
        <p className="mt-4 text-gray-600">
            Register your school to compete in STEM League 2025
        </p>

        {/* responsive centered grid */}
        <div className="grid grid-cols-3 gap-6 mt-6 sm:grid-cols-3 md:grid-cols-3 place-items-center">
            <div>
                <img src={Frame51} alt="Frame 51"
                    className="mx-auto w-full max-w-[50px] sm:max-w-[220px] h-auto object-contain" />
                <p>School Info</p>
            </div>

            <div>
                <img src={Frame53} alt="Frame 53"
                    className="mx-auto w-full max-w-[50px] sm:max-w-[220px] h-auto object-contain" />
                <p>Team Details</p>

            </div>

            <div>
                <img src={Frame54} alt="Frame 54"
                    className="mx-auto w-full max-w-[50px] sm:max-w-[220px] h-auto object-contain" />

                <p>Confirmation</p>
            </div>
        </div>

        {/* centered single image below the grid */}
        <div className="flex justify-center mt-6">
            <img src={Frame61} alt="Frame 61" className="object-contain w-full h-auto mx-auto" />
        </div>
    </div>
</>
)
}

export default TeamDetails
