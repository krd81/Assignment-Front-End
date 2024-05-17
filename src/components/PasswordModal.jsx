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
    <div className="flex absolute items-center inset-y-3/4 inset-x-72">
      <div className="flex border-2 rounded-md border-gray-800 bg-gray-400 p-8">

      <form className="space-y-4 text-lg md:text-xl lg:text-lg ">
        <label htmlFor='oldPassword'>
          Old Password:
        </label>
        <input type='text' id='oldPassword'>

        </input>
        <br/>
        <label htmlFor='newPassword'>
          New Password:
        </label>
        <input type='text' id='newPassword'>

        </input>
        <br/>
        <label htmlFor='confirmNewPassword'>
          Confirm New Password:
        </label>
        <input type='text' id='confirmNewPassword'>

        </input>
        <br/>
        <button type='submit' onClick={handleFormSubmit}>
          OK
        </button>
        <button type='submit' onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
    </div>
    </>
  )
}

export default ChangePassword