import { useState } from "react"
import { useNavigate } from "react-router-dom"

const NewEmployee = () => {
  document.title = "Create User";
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const formDataObj = Object.fromEntries(formData.entries())



    try {
      // const response = await fetch('https://talent-forge-api-atu2.onrender.com/users', {
      const response = await fetch('http://localhost:8002/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formDataObj),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const result = await response.json();

      navigate("/home")

    } catch (error) {
      console.error('Failed to create new employee:', error)
    }
  }

  return (
    <>
    <form className="space-y-4 text-lg md:text-xl lg:text-lg" onSubmit={handleSubmit}>
      <div className="bg-white mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-96">
        <div className="flex flex-col items-center md:items-start lg:items-center">
          {/* Title */}
          <div className="flex justify-center lg:justify-start pb-4">
            <h1 className="text-center text-4xl md:text-3xl lg:text-5xl font-bold">Create User</h1>
          </div>
          {/* Form: job title/dept/date */}
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-1/2">
          <br />

              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="role-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="p-textarea-left p-textarea-right form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="dept-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="dept-input"
                  name="lastName"
                  className="p-textarea-left p-textarea-right form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="email-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Email:
                </label>
                <input
                  type="text"
                  id="email-input"
                  name="email"
                  className="p-textarea-left p-textarea-right form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="password-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Password:
                </label>
                <div className="relative w-full md:w-2/3 lg:w-3/4">
                  <div className="flex items-center justify-between flex-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password-input"
                      name="password"
                      className="pl-2 form-input w-full block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                    />
                    <label htmlFor="show-password-checkbox" className="cursor-pointer flex items-center pl-2">
                      <input
                        type="checkbox"
                        id="show-password-checkbox"
                        className="form-checkbox h-5 w-5 text-indigo-600"
                        onInput={() => setShowPassword(!showPassword)}
                      />
                      <span className="ml-2 text-sm text-gray-700">Show Password</span>
                    </label>
                  </div>
                </div>
              </div>
              <br />
              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="role-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Role:
                </label>
                <input
                  type="text"
                  name="role"
                  className="p-textarea-left p-textarea-right form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="department-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Department:
                </label>
                <input
                  type="text"
                  id="department-input"
                  name="department"
                  className="p-textarea-left p-textarea-right form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-center mt-6">
            <div className="flex flex-col">
                <button
                    type="submit"
                    className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-lg md:text-xl lg:text-lg hover:text-white m-2 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8 min-w-[8rem] border border-blue-500 hover:border-transparent rounded"
                  >
                    Save
                  </button>
            </div>
          </div>
        </div>
      </div>
      </form>
    </>
  )
}

export default NewEmployee
