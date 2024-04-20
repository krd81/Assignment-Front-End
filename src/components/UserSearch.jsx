import { useContext } from "react"
import { AppContext } from '../authentication/AppContext'
import SearchBar from "./SearchBar"

const UserSearch = () => {
  const {allUsers} = useContext(AppContext)
  const [users, setUsers] = allUsers
  document.title = "Company Network"

  // Dummy Data
  const company = {
    name: "Global Imports Ltd",
    description:
      "Use this page to search for employees in the company and make connections. You can search by name, department, or job title.",
    departments: ["marketing", "engineering", "human resources", "sales", "information technology", "board"],
  }



  return (
    <>
      <div className="bg-white mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-96">
        {/* Company Details */}
        <div className="flex flex-col justify-center items-center lg:items-start lg:space-y-4 max-w-6xl mx-auto mt-10 px-5 lg:mt-0">
          <div className="flex flex-col justify-center items-center max-w-lg mx-auto mt-10 px-5">
            <h2 className="text-4xl lg:text-6xl font-bold mb-2 text-center">{company.name}</h2>
            <hr className="border-b border-gray-900 my-6 w-2/3 mx-auto max-w-md lg:hidden" />
            <p className="text-center text-2xl">{company.description}</p>

          </div>
        </div>

        {/* Available Departments */}
        <div className="flex flex-col justify-center items-center lg:items-start lg:space-y-4 max-w-6xl mx-auto mt-10 px-5">
          <div className="w-full lg:w-auto flex flex-col items-center max-w-xl mx-auto mt-10 px-5">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-center">Available Departments</h2>
            <div className="flex flex-col gap-2 justify-center max-w-xl mx-auto mb-12">
              {company.departments.map((department, index) => (
                <span
                  key={index}
                  className="bg-dark-blue text-white px-4 py-2 rounded-md text-lg font-medium flex items-center justify-center"
                >
                  {department.charAt(0).toUpperCase() + department.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>



        {/* Search Bar */}
        <div className="flex flex-col justify-center items-center lg:col-span-1 lg:items-start">
          <div className="flex justify-center items-center max-w-lg mx-auto mt-6 px-5">
            <p className="mb-1 text-center text-xl">Search Users</p>
          </div>
          <div className="flex justify-center items-center max-w-lg mx-auto px-5">
            <SearchBar users={users} />
          </div>
        </div>
      </div>
    </>
  );
};


export default UserSearch;
