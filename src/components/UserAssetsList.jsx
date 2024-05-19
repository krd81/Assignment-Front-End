import { useContext } from 'react'
import { AppContext } from '../authentication/AppContext'
import { useLocation, Link } from "react-router-dom"

// User Assets - reusable component for Applications / Events etc
const UserAssetsList = () => {
  const { listing , loggedInUser } = useContext(AppContext)
  const [ currentListing, setCurrentListing ] = listing
  const [ currentUser ] = loggedInUser
  let asset = '';
  const location = useLocation();

  function assetType () {
    const pathname = location.pathname
    if(pathname.includes('user/listings')){
      asset = 'Applications'
    }
  }

  assetType();

  function showAssets () {
    // Initialize an array to store JSX elements
    let applicationElements = [];
    switch (asset) {
      case 'Applications':
        for (let listing of currentUser.applications) {
          applicationElements.push(
            <li className="list-disc" key={listing._id}>
              <Link to={`/listings/${listing._id}`}>
                {listing.title}
                {setCurrentListing(listing)}
              </Link>
            </li>
          );
        }
        if (currentUser.applications.length < 1) {
          applicationElements.push(
            <p className="text-center mx-6 text-xl md:text-4xl">
              No {asset.toLowerCase()} found
            </p>
          );
        }

      return applicationElements;


    default:
      // return (
        // Direct to 404 not found
      // )
  }
}

  // Title is variable
  document.title = asset
  return (
      <>
        <div className="bg-blue-50 mx-6 md:mx-14 lg:mx-48 my-6 md:my-8 lg:my-8 p-6 md:p-10 lg:p-16 min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 flex-row items-center justify-center">
              <h2 className="text-3xl md:text-5xl lg:text-5xl text-center font-semibold mt-8 mb-4">{`Your ${asset}`}</h2>
              <div className="py-3 md:py-10 lg:py-14 mx-6 text-xl md:text-4xl">
                <ul>
                  {showAssets()}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </>
  )
}

export default UserAssetsList