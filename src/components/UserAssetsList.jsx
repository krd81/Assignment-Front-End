import React, { useContext } from 'react'
import { AppContext } from '../authentication/AppContext'
import { useNavigate, useLocation, useParams } from "react-router-dom"

// User Assets - reusable component for Applications / Events etc
const UserAssetsList = () => {
    const { allListings, loggedInUser } = useContext(AppContext)
    const [ listings ] = allListings
    const [ currentUser ] = loggedInUser
    let asset = '';
    const params = useParams();
    const location = useLocation();
    console.log(params)
    console.log(location)

    function assetType () {
      const pathname = location.pathname
      if(pathname.includes('user/listings')){
        asset = 'Applications'
      }
    }

    assetType();

    function showAssets () {
      switch (asset) {
        case 'Applications':
          for (let listing in currentUser.applications) {
            return (
              `<li>
                ${listing.title}
              </li>`
            )
          }
        break;
        default:
          return (
            `<p>No ${asset.toLowerCase()} found</p>`
          )
      }
    }

    // Title is variable
    document.title = asset
    return (
        <>
          <div className="bg-blue-50 mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-96">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 flex items-center justify-center">
          <h2 className="text-3xl font-semibold mt-8 mb-4">{`Your ${asset}`}</h2>
          <ul>
            {showAssets()}
          </ul>
          </div>
          </div>
          </div>

        </>
    )
}

export default UserAssetsList