import { Fragment, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { AuthContext } from "../authentication/AuthContext"
import { AppContext } from '../authentication/AppContext'



function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function NavBar() {
  const { loggedInUser, profile } = useContext(AppContext)
  const { logout } = useContext(AuthContext)
  const [ currentUser ] = loggedInUser
  const [ setProfileUser ] = profile

    // Define adminRender here to access homeUser
    const adminRender = () => {
      if (currentUser && currentUser.admin) {
        return [
          { name: "Create User", href: "/user-new", current: false },
          { name: "Create Listing", href: "/listing-new", current: false }
        ]
      }
      return []
    }

    // Nav rendered conditionally based on homeUser.admin status
    const navigation = [
      { name: "Home", href: "/home", current: true },
      { name: "Company Network", href: "/user-search", current: false },
      { name: "Opportunities", href: "/opportunities", current: false },
      ...adminRender()
    ]

  const nav = useNavigate()

  // Need a way to re-set the current user as profileUser
  // Whenever another user's profile is viewed, then closed
  // When component unmounts???
  const showProfile = () => {
    // if (token) {
      // const user = decoder(token)
      setProfileUser(currentUser)
      nav(`/profile/${currentUser._id}`)
    // }
  }

  const showUserListings = () => {
    nav(`/opportunities/${currentUser._id}`)
  }



  const handleLogout = () => {
    logout()
    nav("/")
  }

  return (
    <Disclosure as="nav" className="bg-dark-blue">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            {/* div holding menu items */}
            <div className="relative flex h-20 items-center justify-around">
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center ">
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex space-x-4 justify-center">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? "bg-dark-blue text-white hover:border"  : "text-white hover:text-white hover:border",
                          "rounded-md px-8 py-2 text-md font-custom"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {/* profile */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full text-sm focus:outline-none">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-12 w-12  border-2 rounded-full border-gray-800 "
                        src={currentUser?.imageRef} alt="Profile Photo"/>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={showProfile}
                            // href="/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-lg text-black",
                              "cursor-pointer"
                            )}
                          >
                            My Profile
                          </a>
                        )}
                      </Menu.Item>
                      {/* Conditionally render if user has listings?? */}
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={showUserListings}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-lg text-black",
                              "cursor-pointer"
                            )}
                          >
                            Manage Listings
                          </a>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-lg text-black",
                              "cursor-pointer"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
