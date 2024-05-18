const ChangePassword = ({ onClose }) => {

    const handleFormSubmit = () => {
// 1. Check old password matches password stored in DB
// 2. If yes, check new password/confirm passwords are the same - then store new password
// 3. If no, display message to advise old password is incorrect
// 4. Option for admin only to update a user's password - if user is admin, no old password is required

      {onClose}
    }

    const handleCancel = () => {
      {onClose}

    }

  return (

    <>
    <div className="flex absolute items-center inset-y-3/4 inset-x-72 ">
      <div className="flex flex-col items-left border w-3/4 rounded-md border-gray-800 bg-gray-400 p-8 shadow-2xl">

      <form className="space-y-4 space-x-2 text-lg md:text-xl lg:text-lg ">
        <div className="flex flex-row py-2">
          <label htmlFor="oldPassword" className="place-self-center text-2xl w-full">
            Old Password:
          </label>
          <input className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="password" id="oldPassword">
          </input>
        </div>

        <div className="flex flex-row py-2">
        <label htmlFor="oldPassword" className="place-self-center text-2xl w-full">
          New Password:
        </label>
        <input className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        type="password" id="newPassword">

        </input>
        </div>

        <div className="flex flex-row py-2">
        <label htmlFor="oldPassword" className="place-self-center text-2xl w-full">
          Confirm New Password:
        </label>
        <input className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          type="password" id="confirmNewPassword">

        </input>
        </div>

        <div className="flex flex-row justify-around py-2">
        <button className="bg-washed-blue text-white text-lg md:text-xl lg:text-lg p-4 rounded-lg shadow-md m-1 w-32 hover:bg-dark-blue"
        type="submit" onClick={handleFormSubmit}>
          Save
        </button>
        <button className="bg-red-600 hover:bg-white text-white text-lg md:text-xl lg:text-lg hover:text-red-600 w-32 m-1 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8  hover:border-red-600 rounded-lg"
        type="submit" onClick={handleCancel}>
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