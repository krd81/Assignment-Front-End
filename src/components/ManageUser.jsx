import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const ManageUser = () => {
  document.title = "Manage User";
  const [showPassword, setShowPassword] = useState(false);
  const isAdminRef = useRef(false);
  const navigate = useNavigate();
  const params = useParams();
  // Add state object to manage input fields
  // Add cancel button

  const handleSubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const formDataObj = Object.fromEntries(formData.entries())

    const userData = {
      firstName: formDataObj.firstName,
      lastName: formDataObj.lastName,
      email: formDataObj.email,
      password: formDataObj.password,
      role: formDataObj.role,
      department: formDataObj.department,
      admin: isAdminRef.current
    }


    if (passwordCheck(formDataObj.password, formDataObj.confirmPassword) &&
    (!isAdminRef.current || (isAdminRef.current && adminCheck()))) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(userData),
        })

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }

        const result = await response.json();
        console.log(result)

        navigate("/home")

      } catch (error) {
        console.error('Failed to create new employee:', error)
      }
    }
  }

  const passwordCheck = (password1, password2) => {
    if (password1 === password2) {
      return true;
    } else {
      alert("Passwords do not match - please try again")
      return false;
    }
  }


  const adminCheck = () => {
    if (confirm("Are you sure this user should have administrator access?")) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
    <form className="space-y-4 text-lg md:text-xl lg:text-lg" onSubmit={handleSubmit}>
      <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-96">
        <div className="flex flex-col items-center md:items-start lg:items-center">
          {/* Title */}
          <div className="flex justify-center lg:justify-start pb-4">
            <h1 className="text-center text-4xl md:text-3xl lg:text-5xl font-bold">
              {(params["*"].includes("new") ? "Create New User" : (params["*"].includes("edit") ? "Edit User" : ""))}
            </h1>
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
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />

                  <div className="flex items-center justify-between flex-wrap">
              <div className="flex flex-col md:flex-row md:items-center py-4">
                <label htmlFor="password-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Password:
                </label>
                <input
                      type={showPassword ? "text" : "password"}
                      id="password-input"
                      name="password"
                      className="p-textarea-left pl-2 form-input w-full block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                    />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">

                <label htmlFor="confirm-password-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Confirm Password:
                </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirm-password-input"
                      name="confirmPassword"
                      className="p-textarea-left pl-2 form-input w-full block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-3"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center pt-4">

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

              <br />
              <div className="flex flex-col md:flex-row md:items-center">
                <label htmlFor="role-input" className="w-full md:w-1/3 text-center md:text-right md:mr-4">
                  Role:
                </label>
                <input
                  type="text"
                  name="role"
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center pt-6">

              <label htmlFor="admin-checkbox" className="cursor-pointer flex items-center pl-2">
              <span className="ml-2 ">Admin</span>
                <input
                  type="checkbox"
                  id="admin-checkbox"
                  name="admin"
                  className="form-checkbox h-5 w-20 text-indigo-600"
                  onChange={(e) => {isAdminRef.current = e.target.checked}}
                />

              </label>
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

export default ManageUser
