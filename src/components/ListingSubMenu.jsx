import { Menu } from '@headlessui/react'
import { useContext } from 'react'
import { classNames } from '../misc/classNameHelper'
// import { useNavigate } from 'react-router-dom';
import { AppContext } from '../authentication/AppContext';

const ListingSubMenu = ({ dropdown }) => {

    const { loggedInUser, profile } = useContext(AppContext)
    const [ currentUser, setCurrentUser ] = loggedInUser
    const [ profileUser, setProfileUser ] = profile
    // const nav = useNavigate();

    // const showManageListings = () => {
    //     nav(`/opportunities/${currentUser._id}`)
    //   }

  return (
    <>
                              <Menu.Item>
                            <>
                            {({ active }) => (


                          <div className={`dropdown ${dropdown ? "show" : ""} ml-4`}> {/* Adjust the margin as needed */}
                            {/* Arrow indicator */}
                            <span className="text-gray-600">{dropdown ? "▼" : "▶"}</span>
                            {/* Sub-menu items */}
                            <div className="ml-2"  >
                              <a href="/listing-new"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block py-2 text-lg text-black",
                                  "cursor-pointer", "block py-2 text-lg text-gray-600"
                                )}>
                                Create New Listing
                              </a>
                              <a href={`/opportunities/${currentUser._id}`}
                                // onClick={showManageListings}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block py-2 text-lg text-black",
                                  "cursor-pointer", "block py-2 text-lg text-gray-600"
                                ) }
                              >
                                Manage Listings
                              </a>
                            </div>
                          </div>
                         )}
                         </>
                       </Menu.Item>
    </>
  )
}

export default ListingSubMenu