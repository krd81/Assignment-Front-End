/* eslint-disable react/prop-types */
import { useState, useContext } from "react"
import  Auth  from "../authentication/Auth"
import { AppContext } from '../authentication/AppContext'
import { createPortal } from 'react-dom'
import PasswordModal from "./PasswordModal"


const Profile = () => {
  document.title = "Profile"
  const { loggedInUser, profile } = useContext(AppContext)
  const [currentUser, setCurrentUser] = loggedInUser
  const [profileUser, setProfileUser] = profile

  const [isEditMode, setIsEditMode] = useState(false)
  const [showTextInput, setShowTextInput] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [profileFields, setProfileFields] = useState({
    firstName: profileUser.firstName,
    lastName: profileUser.lastName,
    role: profileUser.role,
    department: profileUser.department,
    imageRef: profileUser.imageRef
  })

  const [aboutMeFields, setAboutMeFields] = useState({
    text: profileUser.aboutMe.text,
    careerDevelopment: profileUser.aboutMe.careerDevelopment,
    skills: [...profileUser.aboutMe.skills]
  })

  console.log(currentUser)

  // This is the default list which doesn't change
  // Its rendering of elements (dependent upon whether or not the user has them in their skills list)
  // is controlled by an if statement within the HTML
  const skillList = [
    "Project Management",
    "Leadership",
    "Design",
    "Strategy",
    "Analytical",
    "Quality Assurance",
    "Auditing",
    "Compliance",
    "Training",
    "First Aid",
    "Risk Management"
  ];


    const showUserSkills = (skill, index) => {
      return (
        <button onClick={() => updateUserSkills(skill)}
          key={index}
          className="p-2 m-2 md:m-3 w-36 md:w-56 border rounded-lg text-xs md:text-2xl lg:text-lg border-gray-800 bg-green-300 text-black"
        >
          {skill}
        </button>
      )
    }

    // Function to update the skill list (in profileUser and userSkills state object)
    const updateUserSkills = (skill) => {
      if (profileUser.aboutMe.skills.includes(skill)) {
        if (skillList.includes(skill)) {
            profileUser.aboutMe.skills.splice(profileUser.aboutMe.skills.indexOf(skill), 1);
          } else {
            if (confirm(`This action will delete: "${skill}". Are you sure?`)) {
            profileUser.aboutMe.skills.splice(profileUser.aboutMe.skills.indexOf(skill), 1);
            }
          }
      } else {
        profileUser.aboutMe.skills.push(skill);
      }
      setAboutMeFields({...aboutMeFields, skills: [...profileUser.aboutMe.skills]});
      setUnsavedChanges(true);
    }

    const handleAddUserSkill = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const formDataObj = Object.fromEntries(formData.entries());

      const skill = formDataObj.newSkill
      if (!profileUser.aboutMe.skills.includes(skill) && !skillList.includes(skill)) {
        profileUser.aboutMe.skills.push(skill);
        setAboutMeFields({...aboutMeFields, skills: [...profileUser.aboutMe.skills]});
        setUnsavedChanges(true);
      }
    }

    const handleInputChange = (e, field) => {
      setProfileFields({ ...profileFields, [field]: e.target.value });
      setUnsavedChanges(true);

    }

    const handleAboutMeChange = (e, field) => {
      setAboutMeFields({ ...aboutMeFields, [field]: e.target.value });
      setUnsavedChanges(true);

    }

    const handleCancel = () => {
      if (unsavedChanges && confirm("Unsaved changes will be lost - are you sure?")) {
        setIsEditMode(false);
        setUnsavedChanges(false);
        setProfileFields({ ...profileUser })
        setAboutMeFields({...profileUser.aboutMe})

      } else if (!unsavedChanges) {
        setIsEditMode(false);
      }
    }


  // Applications Dummy Data
  // const applications = []

  // The user profile is required to conditionally render the edit button and job applications
  // We know the userId and that there is a valid token
  // If the ID of the user and the ID from the token match or it is an admin, then the edit button/applications are rendered
  // Profile will call a method passing the userId of the profile and the userId from the token

  function EditButtonRender({Auth}) {
  return (
    <div className="editButtonRender">
      { Auth ?
        (
          <div className="flex flex-col justify-center items-center max-w-lg mx-auto mt-10 mb-10 px-5">
            {isEditMode ?
            <>
              <button
                type="submit"
                onClick={() => setShowPasswordModal(true)}
                className="bg-washed-blue text-white text-lg md:text-2xl lg:text-lg py-2 md:py-3 lg:py-4 px-4 rounded-lg shadow-md m-1 w-56 hover:bg-dark-blue"
              >
                {"Change Password"}
              </button>
              {console.log(showPasswordModal)}
              {showPasswordModal && createPortal(
                <PasswordModal onClose={() => setShowPasswordModal(false)} />,
                // document.getElementById('root')
                document.body
              )}
              <button
                type="submit"
                onClick={(e) => updateProfile(e)}
                className="bg-washed-blue text-white text-lg md:text-2xl lg:text-lg py-2 md:py-3 lg:py-4 px-4 rounded-lg shadow-md m-2 md:m-4 w-56 hover:bg-dark-blue"
              >
                {"Save Changes"}
              </button>
              <button
              type="submit"
              onClick={() => handleCancel()}
              className="bg-red-600 hover:bg-white text-white text-lg md:text-2xl lg:text-lg hover:text-red-600 m-1 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8 w-56 border border-blue-500 hover:border-red-600 rounded-lg"
            >
              {"Cancel"}
            </button>
            </>
            :
              <button
                type="submit"
                onClick={() => setIsEditMode(true)}
                className="bg-washed-blue text-white text-lg md:text-2xl lg:text-lg p-4 lg:mt-6 rounded-lg shadow-md hover:bg-dark-blue"
              >
              {"Edit Profile"}
              </button>
            }
          </div>
        )
        : null
      }
    </div>
  )}





  const updateProfile = async (event) => {
    event.preventDefault();
    setAboutMeFields({...aboutMeFields, skills: [...profileUser.aboutMe.skills]});

    const updatedProfile = {
      firstName: profileUser.firstName,
      lastName: profileUser.lastName,
      role: profileUser.role,
      department: profileUser.department,
      imageRef: profileUser.imageRef,
      aboutMe: {
        text: aboutMeFields.text,
        careerDevelopment: aboutMeFields.careerDevelopment,
        skills: [...profileUser.aboutMe.skills]
      }
    }

    try {
      // const response = await fetch(`https://assignment-back-end.onrender.com/users/${profileUser._id}`, {
        const response = await fetch(`http://localhost:8002/users/${profileUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(updatedProfile),

        })
        const data = await response.json()
        console.log(data)

        if (response.ok) {
            setIsEditMode(false);
            // unsavedChanges = false;
            console.log(profileUser);
          } else {
            throw new Error(`Error: ${response.statusText}`)
          }
        } catch (error) {
          console.error('Failed to create/update user:', error)

        }
      }





  return (
    <>
    {/* <form onSubmit={updateProfile}> */}
      {/* Div encapsulating/creating grid effect */}
      <div className="bg-blue-50 items-center justify-center mx-6 my-6 md:my-12 p-6 md:p-10 lg:mx-20 px-5 ">
        {/* Div for first grid row */}
          <div
            className="flex flex-col sm:items-center sm:justify-center items-center max-w-lg mx-auto px-5
            md:flex md:items-center md:space-x-4 md:max-w-xl md:mx-auto md:px-5 lg:max-w-full lg:mx-0 lg:px-5 lg:mb-16"
          >

            {/* User's name / role */}
            <div className="flex flex-col md:items-center md:justify-center flex-1">
                <h2 className="text-2xl md:text-4xl text-center font-bold mb-2 lg:mt-4">
                  {`${profileFields.firstName} ${profileFields.lastName}`}
                </h2>
                <h3 className="text-xl md:text-3xl font-semibold mb-3">{profileFields.role}</h3>
            </div>
            {/* Department */}
            <div className="flex flex-col md:items-center md:justify-center flex-1">
                <h3 className="text-xl md:text-3xl pb-4">{profileFields.department}</h3>
            </div>

            {/* Profile Picture */}
            <div className="border-2 border-gray-800">
              <img src={profileFields?.imageRef} alt="Profile Photo" />
            </div>

          </div>

          {/* First Column*/}
          {/* Profile Description (About Me) */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-4">
        <div className="flex justify-center lg:justify-start items-baseline flex-col lg:flex-col lg:space-x-4 max-w-6xl mx-auto px-5">

          {(isEditMode && currentUser === profileUser) ? (
            <div className="flex flex-col items-center justify-center w-full mx-auto mt-10 lg:mt-0 px-5 lg:mb-10">
            <label htmlFor="aboutMe" className="text-center mb-3 lg:mb-10 font-bold text-xl md:text-3xl">
                About Me:
              </label>
              <textarea
                id="about-me-text"
                maxLength="220"
                placeholder="(220 character max)"
                value={aboutMeFields.text}
                onInput={(e) => handleAboutMeChange(e, "text")}
                className="p-textarea-left text-input-class md:text-2xl lg:text-lg w-full md:w-3/4 lg:w-full h-56 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center max-w-lg mx-auto mt-10 px-5 lg:mb-10">
              <h2 className="text-2xl md:text-4xl text-center font-bold mb-8">About Me</h2>
              <p className="text-xl md:text-3xl lg:text-2xl px-4 md:px-12 lg:px-4">{aboutMeFields.text}</p>
            </div>
          )}
          {/* END OF FIRST COLUMN DIV */}
        </div>

        {/* Divider */}
        <hr className="border-b border-gray-900 my-10 md:my-12 w-2/3 mx-auto max-w-md lg:hidden" />

        {/* Div for second grid row */}
        <div className="flex flex-col justify-center items-center lg:flex-col lg:space-x-4 max-w-6xl mx-auto px-5 ">
          {/* Checkboxes (Radio Buttons) */}
          <div
            className={`flex flex-col  ${isEditMode ? "w-full" : "max-w-lg"} mx-auto ${
              isEditMode ? "" : "px-5"}`}
          >
            {(isEditMode && currentUser === profileUser) ? (
              <div className="flex flex-col justify-center items-center w-full mx-auto">
                <h2 className="text-center mb-3 lg:mb-10 font-bold text-xl md:text-3xl">
                Skills & Experience:
                </h2>
                  <p className="text-gray-500 text-lg md:text-3xl lg:text-xl italic px-6 md:px-20 lg:px-5 pb-5 md:pb-10">
                    Click the skills below to toggle on/off. Use the + button to add custom skills to your profile.
                  </p>

                {/* Show user skills first (in green) */}
                {aboutMeFields.skills.map((skill, index) => showUserSkills(skill, index))}
                {/* Show any remaining default skills (in blue)*/}

                {skillList.map((skill, index) => {
                  if (aboutMeFields.skills.includes(skill) === false) {
                    return (
                      <button onClick={() => updateUserSkills(skill)}
                      key={index}
                      className="p-2 m-2 md:m-3 w-36 md:w-56 border rounded-lg text-xs md:text-2xl lg:text-lg border-gray-800 bg-dark-green text-white"
                      >
                      {skill}
                      </button>
                    )
                  }
                })}
                <button
                  onClick={() => setShowTextInput(true)}
                  data-testid="add-skill-button"
                  className="bg-dark-green text-white shadow shadow-gray-300 px-4 py-2 mt-5 md:mt-8 mb-4 text-xs md:text-2xl lg:text-lg rounded-md self-center"
                >
                  +
                </button>
                {showTextInput && (
                  <>
                    <form className="flex flex-col justify-center" onSubmit={handleAddUserSkill}>
                      <input
                        type="text"
                        name="newSkill"
                        maxLength="15"
                        placeholder="(15 character max)"
                        className="p-textarea-left border rounded-md w-5/6 lg:w-full mb-4 md:py-3 self-center text-xs md:text-2xl lg:text-lg"
                        />
                      <button type="submit" className="bg-dark-green text-white shadow shadow-gray-300 text-xs md:text-2xl lg:text-lg px-4 py-2 rounded-md mt-2 self-center">
                        Add Skill
                      </button>
                    </form>
                  </>
                )}
            </div>
            ) : (
              // Displays skills on main profile page (userSkills state has not yet been set on first rendering profile)
              <div className="flex flex-col justify-center items-center mb-0">
                <h2 className="text-2xl md:text-4xl text-center font-bold mb-8">Skills & Experience</h2>
                {profileUser.aboutMe.skills.map((index, skill) => showUserSkills(index, skill))}
              </div>
            )}

          </div>

          {/* Divider */}
          <hr className="border-b border-gray-900 my-10 w-2/3 mx-auto max-w-md lg:hidden" />


          {/* END OF SECOND COLUMN DIV */}
        </div>
        {/* Div for third grid row */}
          {/* List of Applications Can applications be rendered using opportunities.jsx ?
          <div className="space-y-4 justify-center items-center max-w-lg mx-auto mt-10 px-5 ">
            {Object.entries(applications).map(([key, value]) => (
              <div key={key} className="bg-washed-blue text-white p-4 rounded-lg shadow-md border border-gray-300">
                <a className="text-lg font-semibold" href="">
                  {value.jobName}
                </a>
                <p className="text-sm">Salary: ${value.jobSalary}</p>
                <p className="text-sm">{value.jobDescription}</p>
              </div>
            ))}
          </div> */}
          {/* Career Development Description */}
          <div className="flex flex-col lg:flex-col lg:space-x-4 lg:justify-start max-w-6xl mx-auto mb-10 px-5 ">
          <div
            className={`flex ${isEditMode ? "flex-col" : ""} ${isEditMode ? "w-full" : "max-w-lg"} mx-auto ${
              isEditMode ? "px-5" : ""
            } justify-center items-center`}
          >
            {(isEditMode && currentUser === profileUser) ? (
              <div className="w-full mx-auto px-5 flex flex-col items-center">
                {/* Added items-center class */}
                <label htmlFor="aboutMe" className="text-center mb-3 text-xl md:text-3xl font-bold">
                  Career Development:
                </label>
                <textarea
                  id="about-me-career-development"
                  maxLength="220"
                  placeholder="(220 character max)"
                  value={aboutMeFields.careerDevelopment}
                  onInput={(e) => handleAboutMeChange(e, "careerDevelopment")}
                  className="p-textarea-left text-input-class md:text-2xl lg:text-lg w-full md:w-3/4 lg:w-full h-56 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" // Tailwind classes to adjust width and height
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl md:text-4xl text-center font-bold mb-8">Career Development</h2>
                <p className="text-xl md:text-3xl lg:text-2xl px-4 md:px-12 lg:px-4">{aboutMeFields.careerDevelopment}</p>
              </div>
            )}
          </div>
          {/* END OF THIRD COLUMN DIV */}
        </div>
        {/* End of div encapsulating/creating grid effect */}
      </div>
      {/* </form> */}
      <div
            className="flex flex-col sm:items-center sm:justify-center items-center max-w-lg mx-auto px-5
            md:flex md:items-center md:space-x-4 md:max-w-xl md:mx-auto md:px-5 lg:max-w-full lg:mx-0 lg:px-5 "
          >
          {/* Edit Button */}
          <div className="flex flex-col justify-end">
              <EditButtonRender Auth={Auth(profileUser._id, currentUser)}/>
            </div>
      </div>
      </div>
    </>
  )
}

export default Profile;
