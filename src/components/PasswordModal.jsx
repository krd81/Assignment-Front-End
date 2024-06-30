import { useContext } from "react"
import { AppContext } from '../authentication/AppContext'

const ChangePassword = ({ onClose }) => {
  const { loggedInUser, profile } = useContext(AppContext);
  const [currentUser, setCurrentUser] = loggedInUser
  const [profileUser, setProfileUser] = profile


  const handleFormSubmit = async (event) => {
    event.preventDefault();
// 1. Check old password matches password stored in DB
// 2. If yes, check new password/confirm passwords are the same - then store new password
// 3. If no, display message to advise old password is incorrect
// 4. Option for admin only to update a user's password - if user is admin, no old password is required
    async function apiCall(URL, HTTPMethod, HTTPBody) {
      const response = fetch(URL, {
        method: HTTPMethod,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(HTTPBody)
      });
      return response;
    }

      const formData = new FormData(event.currentTarget)
      const formDataObj = Object.fromEntries(formData.entries())

      if ((formDataObj.oldPassword && formDataObj.newPassword && formDataObj.confirmNewPassword) ||
          (currentUser.admin && formDataObj.newPassword && formDataObj.confirmNewPassword)) {
        const oldPassword = formDataObj.oldPassword;
        const newPassword = formDataObj.newPassword;
        const confirmNewPassword = formDataObj.confirmNewPassword;

        // API call to compare user's password
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          // let response = await apiCall(`https://assignment-back-end.onrender.com/users/${profileUser._id}/password`, 'POST', {password: oldPassword})
          // let response = await apiCall(`http://localhost:8002/users/${profileUser._id}/password`, 'POST', {password: oldPassword})
          let response = await apiCall(`${apiUrl}/users/${profileUser._id}/password`, 'POST', {password: oldPassword})
          if (response.ok || currentUser.admin) {
            if (newPassword === confirmNewPassword) {
              // Second API call to change user's password
              try {
                // response = await apiCall(`https://assignment-back-end.onrender.com/users/${profileUser._id}`, 'PUT', {password: newPassword})
                // response = await apiCall(`http://localhost:8002/users/${profileUser._id}`, 'PUT', {password: newPassword})
                response = await apiCall(`${apiUrl}/users/${profileUser._id}`, 'PUT', {password: newPassword})
                if (response.ok) {
                  alert("Your password has been changed");
                    // Close portal
                    onClose();
                    // Clear password fields
                    clearFields();
                }
              } catch (error) {
                console.error('Failed to change password:', error);
              }
          } else {
            alert("Passwords do not match - please try again");
            // Clear password fields
            clearFields();
          }
        } else {
          alert("Old Password is incorrect - please try again");
          // Clear password fields
          clearFields();
        }
      } catch (error) {
          console.error('Failed to change password:', error);
        // Clear password fields
        clearFields();
      }
    } else {
      alert("Ensure all fields are complete");
      // Clear password fields
      clearFields();
    }
  }

  const clearFields = () => {
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";
  }



  return (
    <>
      <div className="flex absolute items-center inset-y-3/4 inset-x-72 ">
        <div className="flex flex-col items-left border w-3/4 rounded-md border-gray-800 bg-gray-400 p-8 shadow-2xl">

          <form onSubmit={handleFormSubmit} className="space-y-4 space-x-2 text-lg md:text-xl lg:text-lg ">
            <div className="flex flex-row py-2">
              <label htmlFor="oldPassword" className="place-self-center text-2xl w-full">
                Old Password:
              </label>
              <input className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="password" id="oldPassword" name="oldPassword">
              </input>
            </div>

            <div className="flex flex-row py-2">
              <label htmlFor="newPassword" className="place-self-center text-2xl w-full">
                New Password:
              </label>
              <input className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="password" id="newPassword" name="newPassword">
              </input>
            </div>

            <div className="flex flex-row py-2">
              <label htmlFor="confirmNewPassword" className="place-self-center text-2xl w-full">
                Confirm New Password:
              </label>
              <input className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                type="password" id="confirmNewPassword" name="confirmNewPassword">

              </input>
            </div>

            <div className="flex flex-row justify-around py-2">
              <input className="bg-washed-blue text-white text-lg md:text-xl lg:text-lg p-4 rounded-lg shadow-md m-1 w-32 hover:bg-dark-blue"
                type="submit" value="Save">
              </input>
              <button className="bg-red-600 hover:bg-white text-white text-lg md:text-xl lg:text-lg hover:text-red-600 w-32 m-1 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8  hover:border-red-600 rounded-lg"
                type="submit" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChangePassword