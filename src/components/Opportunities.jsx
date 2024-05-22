import { useState, useEffect, useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../authentication/AppContext'
import Fuse from "fuse.js" // Import Fuse.js library
import IonIcon from '@reacticons/ionicons'
import "../assets/css/App.css"
import dateFormat from "../misc/dateFormat"

// DONE - Icon for NEW listings: 'notifications-outline' or <ion-icon name="megaphone-outline"></ion-icon>
// Icon for expiring listings: 'alert' | 'alert-circle' | 'alert-circle-outline'
// DONE - Icon for favourite listings:  <ion-icon name="star"></ion-icon> <ion-icon name="star-outline"></ion-icon>
// DONE - Icon to show job has been applied for: 'checkmark-circle-outline'
// ???? - Icon to show applications: 'people' | 'people-outline'
// Don't show expired listings

const JobListing = () => {
  const { loggedInUser, allListings, listing } = useContext(AppContext)
  const [currentUser, setCurrentUser] = loggedInUser
  const [ listings ] = allListings
  const [ currentListing, setCurrentListing ] = listing

  const nav = useNavigate()

  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredListings, setFilteredListings] = useState([...listings])
  const [favourites, setFavourites] = useState(null); // Needs to be null so that the user's favourites aren't over-written with empty array on mount

  console.log(favourites)
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

  //useEffect hook allows the favourites state to be updated once the current user object becomes available
  useEffect(() => {
    if (currentUser && currentUser.listingsFavourites) {
      setFavourites([...currentUser.listingsFavourites]);
    }
  }, [currentUser]);



  // Function to highlight user's starred listings
  const displayFavouriteIcon = (listing) => {

    if (favourites) {
      // Find and add to isFavourite if the current listing is in favourites
      let isFavourite = favourites.find(favourite => favourite._id === listing._id);

      // Set iconName based on whether the listing is a favourite or not
      // isFavourite is either defined (as the found listing) or undefined
      const iconName = isFavourite ? "star" : "star-outline";
      const iconColour = isFavourite ? "text-yellow-400" : "text-gray-300";

      return (
        <>
          <a className={`md:p-1 ${iconColour}`} onClick={event => toggleFavourite(listing, event)}>
            <IonIcon name={iconName} size="large" />
          </a>
        </>
      );
    }
  }


  const toggleFavourite = (listing, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Stop the event from propagating to parent elements
    }

    if (favourites.length > 0) {
      if (favourites.find(favourite => favourite._id === listing._id)) {
        setFavourites(prev => prev.filter(prevListing => prevListing._id !== listing._id));
      } else {
        setFavourites([...favourites, listing]);
      }
    } else {
      setFavourites([listing]);
    }
  }

  useEffect(() =>  {
    const updateUserFavourites = async () => {
      console.log("Update DB effect called")
      console.log(favourites)
      // If favourites is null (i.e. on initial mount, do not update the database)
      if (favourites) {
        const favouritesUpdate = {
          listingsFavourites: favourites.length > 0 ? [...favourites] : []
        };

      try {
        const response = await fetch (`http://localhost:8002/users/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(favouritesUpdate)
        });
        const result = await response.json();
        console.log(result)
      } catch (error) {
        console.error('User\'s favourite listings not updated:', error);
      }
    }
   }
   if (currentUser) {
    updateUserFavourites();
   }
  }, [favourites, currentUser]);


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

  function newListing(listing) {
    const datePosted = new Date(listing.datePosted)
    const today = new Date(Date.now())
    const differenceInTime = today.getTime() - datePosted.getTime()
    const daysSincePosted = Math.floor(differenceInTime / (1000 * 3600 * 24))

    if (daysSincePosted < 7) {
      return true
    } else {
      return false
    }
  }




  document.title = "Opportunities"

  return (
    <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-32">
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
            {filteredListings.map((listing, index) => (

                listing.listingActive && (
                  <>
                    <div key={index} className={`overflow-hidden shadow-lg rounded-lg border ${newListing(listing) ? "border-green-600 bg-green-50" : "bg-white"} select-list-item`}>
                      <div className="p-4 " onClick={() => {listingClick(listing)}}>
                        <div className="flex justify-between">
                          <div>
                            {currentUser?.applications.map((application, index) => {
                              if (application._id === listing._id) {
                                return (
                                  <>
                                    <span id={index} className={`text-green-600 md:p-1`}>
                                      <IonIcon name='checkmark-circle-outline' size="large" />
                                    </span>
                                  </>
                                )
                              }
                            })
                          }

                          </div>
                          <div>
                            <h2 className="text-xl text-center font-medium text-gray-900 ">{listing.title}</h2>
                            <p className="text-base text-center">{listing.department}</p>
                          </div>
                          <div className="px-2">
                            {displayFavouriteIcon(listing)}
                          </div>
                        </div>

                        <p className="text-base mt-2">{listing.roleType}</p>
                        <p className="text-base mt-2">{listing.location}</p>
                        <p className="text-base mt-2">Salary: ${Number(listing.salary).toLocaleString()}</p>
                        <p className="text-base mt-2">Closing Date: {dateFormat(listing.dateClosing)}</p>
                        <p className="text-base mt-2">Job Description: {displayPreview(listing.description.text)}</p>
                        {newListing(listing)}
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
