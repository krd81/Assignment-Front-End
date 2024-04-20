import React from 'react'
import { useState, useEffect, useContext } from "react"
import IonIcon from '@reacticons/ionicons'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../authentication/AppContext'


const OpportunitiesByCreator = () => {
    // App level state objects
    const { allListings, listing, loggedInUser } = useContext(AppContext)
    const [listings, setListings] = allListings
    const [currentListing, setCurrentListing] = listing
    const [currentUser, setCurrentUser] = loggedInUser

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

    const handleEdit = (event) => {
        // Open Listing in edit mode
    }

    const handleDelete = (event) => {
        // Delete Listing
    }




    return (
        <>
            <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-96">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3 flex items-center justify-center">
                        <h2>
                            View, edit or delete listings:
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
            {userListings.map((listing) => (
              <div key={listing._id} className="bg-white overflow-hidden shadow-lg rounded-lg border">
                <div className="p-4"
                  onClick={() => {
                    handleView(listing)
                    }}>
                  <h2 className="text-xl text-center font-medium text-gray-900">{listing.title}</h2>
                  <p className="text-base text-center">{listing.department}</p>
                  <p className="text-base mt-2">Posted Date: {listing.datePosted}</p>

                  <p className="text-base mt-2">{listing.listingActive}</p>
                  <span className='flex justify-evenly text-indigo-100'>
                    {/* View Listing */}
                    <a
                    onClick={() => {
                      handleView(listing)
                      }}>
                      <IonIcon name="eye-outline" size="large" />

                    </a>
                    {/* Edit Listing */}
                    <a
                    >
                      <IonIcon name="brush-outline" size="large" />

                    </a>
                    {/* Delete Listing */}
                    <a
                    >
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