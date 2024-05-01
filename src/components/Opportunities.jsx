import { useState, useEffect, useContext } from "react"

import { useNavigate } from 'react-router-dom'
import { AppContext } from '../authentication/AppContext'
import Fuse from "fuse.js" // Import Fuse.js library

// Icon for NEW listings: 'notifications-outline' or <ion-icon name="megaphone-outline"></ion-icon>
// Icon for expiring listings: 'alert' | 'alert-circle' | 'alert-circle-outline'
// Icon to show job has been applied for: 'checkmark-circle-outline'
// Icon to show applications: 'people' | 'people-outline'
// export const ListingContext = createContext()

const JobListing = () => {
  const { allListings, listing } = useContext(AppContext)
  const [ listings ] = allListings
  const [ setCurrentListing ] = listing

  const nav = useNavigate()



  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredListings, setFilteredListings] = useState([...listings])

  // Function to handle department selection
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value)
  }

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Effect to update filtered listings when searchQuery or selectedDepartment changes
  useEffect(() => {
    let newFilteredListings = [...listings]

    if (selectedDepartment !== "All") {
      newFilteredListings = newFilteredListings.filter((listing) => listing.department === selectedDepartment)
    }

    if (searchQuery.trim() !== "") {
      const fuseOptions = {
        keys: ["title", "department"], // Search in 'title' and 'department' fields
        includeScore: true,
      }
      const fuse = new Fuse(newFilteredListings, fuseOptions)
      const searchResult = fuse.search(searchQuery.trim())
      newFilteredListings = searchResult.map((result) => result.item)
    }

    setFilteredListings(newFilteredListings)
  }, [searchQuery, selectedDepartment, listings])


    // Functionality to apply for role
    function handleApply(listing) {
      // No preceding / makes the path relative and redirects to apply page
      nav(`/listings/${listing._id}/apply`)
      setCurrentListing(listing)
    }



  function listingClick(listing) {
    nav(`/listings/${listing._id}`)
    setCurrentListing(listing)
  }

  // Function to display a preview of the job description
  // The full text is displayed on the ViewListing page
  function displayPreview(text) {
    if (!text) {
      return '';
    }
    return text.split(' ').slice(0, 20).join(' ');
  }

  // Function to format salary as currency with 1000s separator
  function formatSalary(salary) {
    return `$${Number(salary).toLocaleString()}`;
  }


  document.title = "Opportunities"

  return (
    <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-96">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3 flex items-center justify-center">
          <h2 className="text-3xl font-semibold mt-8 mb-4">Internal Opportunities</h2>
        </div>
        <div className="md:col-span-1 flex flex-col justify-start items-center md:items-start">
          <div className="w-full">
            <label htmlFor="department" className="block text-gray-700">
              Filter by Department:
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onInput={handleDepartmentChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="IT">Information Technology</option>
            </select>
          </div>
          <div className="mt-4 w-full">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onInput={handleSearchChange}
              className="p-textarea-left mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="md:col-span-2 mb-8">
          <div className="grid grid-cols-1 gap-6">
            {filteredListings.map((listing) => (

                listing.listingActive && (
                  <>
                    <div key={listing._id} className="bg-white overflow-hidden shadow-lg rounded-lg border">
                      <div className="p-4" onClick={() => {listingClick(listing)}}>
                        <h2 className="text-xl text-center font-medium text-gray-900">{listing.title}</h2>
                        <p className="text-base text-center">{listing.department}</p>
                        <p className="text-base mt-2">{listing.roleType}</p>
                        <p className="text-base mt-2">{listing.location}</p>
                        <p className="text-base mt-2">Salary: {formatSalary(listing.salary)}</p>
                        <p className="text-base mt-2">Posted Date: {listing.datePosted}</p>
                        <p className="text-base mt-2">Job Description: {displayPreview(listing.description.text)}</p>
                        {/* Add more job details as needed */}
                      </div>
                        <div className="flex justify-center">
                          <button onClick={() => handleApply(listing)} className="bg-dark-blue hover:bg-washed-blue text-white font-bold py-2 px-4 rounded mb-5">
                            Apply Now
                          </button>
                        </div>
                  </div>
              </>
            )

            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobListing;
