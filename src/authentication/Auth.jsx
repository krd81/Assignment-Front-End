// This module provides a function to obtain the user and token and return matching status to the caller
// If the user is an admin, the function returns true
// If the profile's user id is the same as the token, the function returns true otherwise it returns false

// Ensure the profile is passed in as the ID ONLY, and the current user is passed in as the ENTIRE OBJECT


export default function Auth(profileUserId, currentUser) {





  let match

    if (currentUser?.admin) {
      match = true
    } else if (profileUserId === currentUser._id) {
      match = true
    } else {
      match = false
    }



  return match
}
