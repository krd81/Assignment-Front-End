// import React from 'react'
import { useState, useEffect, useContext } from "react"
import IonIcon from '@reacticons/ionicons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../authentication/AppContext'
import dateFormat from "../misc/dateFormat"
import "../assets/css/App.css"


export const OpportunitiesByCreator = () => {
  // App level state objects
  const { allListings, listing, loggedInUser } = useContext(AppContext)
  const [ listings, setListings ] = allListings
  const [ currentListing, setCurrentListing ] = listing
  const [ currentUser, setCurrentUser ] = loggedInUser

  // Local state object
  let [userListings, setUserListings] = useState([])
  console.log(currentUser)
  console.log(currentUser._id)
  console.log(listings)
  console.log(listings[0].creator._id)


  useEffect(() => {
    let results = []
    for (let listing of listings) {
      if (listing && listing.creator) {
        if (listing.creator._id === currentUser._id) {
          console.log("Listing creator id matches user's id")
          results.push(listing)
        } else {
          console.log("Unable to tell if id's match")
        }
      }
    }
    setUserListings(results)
  }, [setUserListings, listing, listings, currentUser])


  const nav = useNavigate()


  const handleView = (listing) => {
    // Open Listing in view mode
    nav(`/listings/creator/${listing._id}`)
    setCurrentListing(listing)
  }

  const handleEdit = (listing) => {
    // Open Listing in edit mode
    // Navigates to 'NewListing' component
    nav(`/listings/creator/${listing._id}/edit`)
    setCurrentListing(listing)
  }

  const handleDelete = (listing) => {
    if (confirm("This listing will be deleted. Are you sure?")) {
      // Delete Listing
      deleteListing(listing._id)
      // Update userListing and global listings state variables
      setUserListings(prevUserListings => prevUserListings.filter((prevUserListing) => prevUserListing !== listing))
      setListings(prevListings => prevListings.filter((prevListing) => prevListing !== listing))
      // Re-load listings excl the deleted listing
      nav(`/opportunities/${currentUser._id}`)
    }
  }

  const deleteListing = async (listingID) => {
    try {
      // const response = await fetch('https://talent-forge-api-atu2.onrender.com/listings', {
      await fetch(`http://localhost:8002/listings/${listingID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
  }


  return (
        <>
            <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-40">
                <div className="grid grid-cols-1  gap-4">
                    <div className="md:col-span-3 flex items-center justify-center">
                        <h2>
                            View, edit or delete listings:
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {/* <div className="flex-row"> */}
            {userListings.map((listing) => (
              <div key={listing._id} className={`${listing.listingActive ? 'bg-white' : 'bg-gray-300'} max-w-full overflow-hidden shadow-lg rounded-lg border select-list-item`}>
                <div className="p-4 md:flex-row ">
                  {/* onClick={() => {
                    handleView(listing)
                    }} */}
                    <div className="md:flex">
                  <div className="md:w-2/3">
                    <h2 className="text-xl md:text-3xl lg:text-3xl text-center md:text-left font-medium  md:p-2 text-gray-900">{listing.title}</h2>
                    <p className="text-base md:text-3xl lg:text-3xl text-center md:text-left md:px-2">{listing.department}</p>
                  </div>
                  <div className="md:w-1/3">
                  <p className="text-base text-center pb-3 md:text-xl lg:text-2xl mt-2">Posted: {dateFormat(listing.datePosted)}</p>
                  {console.log(listing.datePosted)}
                  </div>
                  </div>

                  <span className='flex md:flex justify-evenly md:justify-evenly text-gray-500  md:text-2xl'>
                    {/* View Listing */}
                    <a className="md:p-1 hover:text-blue-700"
                    onClick={() => {
                      handleView(listing)
                      }}>
                      <IonIcon name="eye-outline" size="large" />
                    </a>
                    {/* Edit Listing */}
                    <a className="md:p-1 hover:text-blue-700"
                    onClick={() => {
                      handleEdit(listing)
                      }}>
                      <IonIcon name='pencil-outline' size="large" />
                    </a>
                    {/* Delete Listing */}
                    <a className="md:p-1 hover:text-blue-700"
                    onClick={() => {
                      handleDelete(listing)
                      }}>
                      <IonIcon name="trash-outline" size="large" />
                    </a>


                  </span>

                </div>
              </div>
            ))}
          </div>
                </div>
            </div>

        </>
  )
}

export default OpportunitiesByCreator