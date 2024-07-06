import { useState, useEffect, useContext, useCallback } from "react"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../authentication/AppContext'
import Fuse from "fuse.js" // Import Fuse.js library
import IonIcon from '@reacticons/ionicons'
import "../assets/css/App.css"
import dateFormat from "../misc/dateFormat"

// DONE - Icon for NEW listings: 'notifications-outline' or <ion-icon name="megaphone-outline"></ion-icon>
// DONE - Icon for expiring listings: 'alert' | 'alert-circle' | 'alert-circle-outline'
// DONE - Icon for favourite listings:  <ion-icon name="star"></ion-icon> <ion-icon name="star-outline"></ion-icon>
// DONE - Icon to show job has been applied for: 'checkmark-circle-outline'
// ???? - Icon to show applications: 'people' | 'people-outline'
// DONE - Don't show expired listings

const JobListing = () => {
  const { loggedInUser, allListings, listing } = useContext(AppContext);
  const [currentUser, setCurrentUser] = loggedInUser;
  const [listings, setListings] = allListings;
  const [currentListing, setCurrentListing] = listing;

  const nav = useNavigate();

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredListings, setFilteredListings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [faveData, setFaveData] = useState(null);
  const [filterOption, setFilterOption] = useState("none");
  const [noListingsFound, setNoListingsFound] = useState(false);


  console.log(currentUser)
  console.log(faveData)
  console.log(listings)
  // Function to handle department selection
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value)
  }

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Listings that have been posted in the last 7 days are shown with green b/ground & green border
  const newListing = useCallback((listing) => {
    return listingTimeline(listing).sincePosted < 7;
  }, []);
  //useEffect hook allows the favourites state to be updated once the current user object becomes available
  useEffect(() => {
    if (currentUser && currentUser.listingsFavourites) {
      // setFavourites([...currentUser.listingsFavourites]);
      setFaveData([...currentUser.listingsFavourites]);
    }
  }, [currentUser]);





  // Effect to update filtered listings when searchQuery or selectedDepartment changes
  // Also controls filterOption (i.e. radio buttons for new, favourites, applied)
  useEffect(() => {
    let newFilteredListings = [...listings];

    if (selectedDepartment !== "All") {
      newFilteredListings = newFilteredListings.filter(listing => listing.department === selectedDepartment);
    }

    if (searchQuery.trim() !== "") {
      const fuseOptions = {
        keys: ["title", "department"],
        includeScore: true,
      };
      const fuse = new Fuse(newFilteredListings, fuseOptions);
      const searchResult = fuse.search(searchQuery.trim());
      newFilteredListings = searchResult.map((result) => result.item);
    }

    switch (filterOption) {
      case "new":
        newFilteredListings = newFilteredListings.filter(listing => newListing(listing));
        break;
      case "favourites":
        if (currentUser && currentUser.listingsFavourites) {
          newFilteredListings = [...currentUser.listingsFavourites];
        }
        break;
      case "applied":
        if (currentUser && currentUser.applications) {
          newFilteredListings = [...currentUser.applications];
        }
        break;
      default:
        newFilteredListings = [...listings];
        break;
    }

    setFilteredListings(newFilteredListings);

    setNoListingsFound(newFilteredListings.length === 0);
  }, [searchQuery, newListing, selectedDepartment, listings, currentUser, filterOption]);





  // Function to highlight user's starred listings
  const displayFavouriteIconOld = (listing) => {

    if (!favourites) {
      // Handle the case when favourites is undefined or null
      return null;
    }

    // if (favourites) {
      // Find and add to isFavourite if the current listing is in favourites
      let isFavourite = favourites.find(favourite => favourite._id === listing._id);

      // Set iconName based on whether the listing is a favourite or not
      // isFavourite is either defined (as the found listing) or undefined
      const iconName = isFavourite ? "star" : "star-outline";
      // const iconName =  "star-outline";
      const iconColour = isFavourite ? "text-yellow-400" : "text-gray-300";
      // const iconColour =  "text-gray-300";

      return (
        <>
          <a className={`md:p-1 ${iconColour}`} onClick={event => toggleFavourite(listing, event)}>
            <IonIcon name={iconName} size="large" />
          </a>
        </>
      );
    // }
  }


  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/users/${currentUser?._id}`)
      .then(response => response.json())
      .then(data => setFaveData(data.listingsFavourites))
      .catch(error => console.error('Error:', error));


  }, [currentUser]);


  // Function to highlight user's starred listings
  const displayFavouriteIcon = (listing) => {
    console.log(faveData);

      // Find and add to isFavourite if the current listing is in favourites
      let isFavourite = faveData?.find(favourite => favourite._id === listing._id);

      // Set iconName based on whether the listing is a favourite or not
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



  const toggleFavourite = (listing, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Stop the event from propagating to parent elements
    }

    // if (favourites.length > 0) {
    if (faveData.length > 0) {
      // if (favourites.find(favourite => favourite._id === listing._id)) {
      if (faveData.find(favourite => favourite._id === listing._id)) {
        // setFavourites(prev => prev.filter(prevListing => prevListing._id !== listing._id));
        setFaveData(prev => prev.filter(prevListing => prevListing._id !== listing._id));
      } else {
        // setFavourites([...favourites, listing]);
        setFaveData([...faveData, listing]);
      }
    } else {
      setFaveData([listing]);
    }
  }

  useEffect(() =>  {
    const updateUserFavourites = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      // If favourites is null (i.e. on initial mount, do not update the database)
      // if (favourites) {
      if (faveData) {
        const favouritesUpdate = {
          // listingsFavourites: favourites.length > 0 ? [...favourites] : []
          listingsFavourites: faveData.length > 0 ? [...faveData] : []
        };

      try {
        await fetch (`${apiUrl}/users/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(favouritesUpdate)
        });
      } catch (error) {
        console.error('User\'s favourite listings not updated:', error);
      }
    }
   }
   if (currentUser) {
    updateUserFavourites();
   }
  }, [faveData, currentUser]);


  // Functionality to apply for role
  function handleApply(listing) {
    if ((currentUser &&
      currentUser.applications.find(application => application._id === listing._id) &&
        confirm("You have already applied for this role. Are you sure you would like to continue?")
      ) || (currentUser &&
        !currentUser.applications.find(application => application._id === listing._id))) {
        nav(`/listings/${listing._id}/apply`)
        setCurrentListing(listing)
      }
  }


  function listingClick(listing) {
    const isExpired = expiredListing(listing);

    nav(`/listings/${listing._id}`, { state: { isExpired } })
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

  // Returns the number of days since
  function listingTimeline(listing) {
    const today = new Date(Date.now());

    const datePosted = new Date(listing.datePosted);
    const timeSincePosted = today.getTime() - (datePosted ? datePosted.getTime() : 0);
    const daysSincePosted = timeSincePosted > 0 ? Math.floor(timeSincePosted / (1000 * 3600 * 24)) : 10; // If posted date is unavailable or in the future, make the number of days 10, so that the listing will not show as new

    const dateClosing = new Date(listing.dateClosing);
    const timeUntilClosing = (dateClosing ? dateClosing.getTime() : today.getTime()) - today.getTime();
    const daysUntilClosing = timeUntilClosing ? Math.floor(timeUntilClosing / (1000 * 3600 * 24)) : 10; // If closing date is unavailable or in the past, make the number of days 10, so that the listing will not show as expiring

    return {sincePosted: daysSincePosted, untilClosing: daysUntilClosing}
  }



  // Listings which have less than 5 days until the closing date are shown with a red border
  function lastChanceListing(listing) {
    if (listingTimeline(listing).untilClosing < 5) {
      return true
    } else {
      return false
    }
  }

  // Listings which have gone past the closing date have the Apply Now button rendered inactive
  function expiredListing(listing) {
    if (listingTimeline(listing).untilClosing < 0) {
      return true
    } else {
      return false
    }
  }

  // Listings where the closing date was more than 7 days ago are not shown
  function removeListing(listing) {
    if (listingTimeline(listing).untilClosing < -6) {
      return true
    } else {
      return false
    }
  }


  document.title = "Opportunities"

  return (
    <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-8 lg:p-16 xl:mx-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3 flex items-center justify-center">
          <h2 className="text-3xl font-semibold mt-8 md:my-4 mb-4">Internal Opportunities</h2>
        </div>
        <div className="flex-row md:col-span-1 md:flex md:flex-col md:justify-start md:items-start">
          <div className="w-full">
            <label htmlFor="department" className="block text-gray-700">
              Filters:
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
          <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-none md:flex-col my-8 md:my-0">
          <div className="inline-flex items-center md:pt-6">
            <input
              type="radio"
              id="new-listings"
              name="listingsFilter"
              value="new"
              checked = {filterOption === "new"}
              className="form-checkbox h-5 w-7 text-indigo-600"
              onChange={e => setFilterOption(e.target.value)}
            />
            <label htmlFor="new-listings" className="cursor-pointer flex items-center pl-2"></label>
            <span className="ml-0 md:ml-2"><em className="text-xl not-italic">☺︎ </em> New Job Listings</span>
          </div>
          <div className="inline-flex items-center md:pt-6">
            <input
              type="radio"
              id="favourite-listings"
              name="listingsFilter"
              value="favourites"
              checked = {filterOption === "favourites"}
              className="form-checkbox h-5 w-7 text-indigo-600"
              onChange={e => setFilterOption(e.target.value)}
            />
            <label htmlFor="favourite-listings" className="cursor-pointer flex items-center pl-2"></label>
            <span className="ml-0 md:ml-2"><em className="text-xl not-italic">☆ </em> Favourites</span>
          </div>
          <div className="inline-flex items-center md:pt-6">
            <input
              type="radio"
              id="applied-listings"
              name="listingsFilter"
              value="applied"
              checked = {filterOption === "applied"}
              className="form-checkbox h-5 w-7 text-indigo-600"
              onChange={e => setFilterOption(e.target.value)}
            />
            <label htmlFor="applied-listings" className="cursor-pointer flex items-center pl-2"></label>
            <span className="ml-0 md:ml-2"><em className="text-xl not-italic">☑︎ </em>Applied</span>
          </div>
          <div className="inline-flex items-center md:pt-6">
            <input
              type="radio"
              id="show-all"
              name="listingsFilter"
              // defaultValue={true}
              value="none"
              checked = {filterOption === "none"}
              className="form-checkbox h-5 w-7 text-indigo-600"
              onChange={e => setFilterOption(e.target.value)}
            />
            <label htmlFor="show-all" className="cursor-pointer flex items-center pl-2"></label>
            <span className="ml-0 md:ml-2"><em className="text-xl not-italic">☒︎ </em>No Filter</span>
          </div>
          </div>
        </div>
        <div className="md:col-span-2 mb-8">
          <div className={`${noListingsFound ? "visible" : "invisible h-0"}`}>
          <div className={`flex justify-center items-center h-72`}>
            <span className="text-7xl text-center text-gray-400 leading-snug">
              No opportunities found
            </span>
          </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredListings.map((listing, index) => (

                (listing.listingActive && !removeListing(listing)) && (
                  <>
                    <div key={index} className={`overflow-hidden shadow-lg rounded-lg select-list-item
                    ${newListing(listing) ? "border-green-600 border-2 bg-green-100" : "bg-white border"}
                    ${lastChanceListing(listing) ? "border-red-600 border-2" : "bg-white border"}`}>
                      <div className="p-4 " onClick={() => {listingClick(listing)}}>
                        <div className="flex justify-between">
                          <div>
                            {currentUser?.applications.map((application, index) => {
                              if (application._id === listing._id) {
                                return (
                                  <>
                                    <span id={index} className={`text-green-600 -mr-9`}>
                                      <IonIcon name='checkmark-circle-outline' size="large" />
                                    </span>
                                  </>
                                )
                              }
                            })
                          }

                          </div>
                          <div>
                            <h2 className="text-xl text-center font-medium text-gray-900 pl-14">{listing.title}</h2>
                            <p className="text-base text-center pl-14">{listing.department}</p>
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
                          <button
                            onClick={() => {
                              if (!expiredListing(listing)) {
                                handleApply(listing);
                              }
                            }}
                            className={`${expiredListing(listing) ? "bg-gray-300 text-gray-500 cursor-default expired-button" : "bg-dark-blue text-white"}  font-bold py-2 px-4 rounded mb-5`}
                            // className="bg-dark-blue text-white font-bold py-2 px-4 rounded mb-5"
                          >
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
