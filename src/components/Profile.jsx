/* eslint-disable react/prop-types */
import { useState, useContext } from "react"
import  Auth  from "../authentication/Auth"
import { AppContext } from '../authentication/AppContext'



const Profile = () => {
  document.title = "Profile"
  const { loggedInUser, profile } = useContext(AppContext)
  const [currentUser, setCurrentUser] = loggedInUser
  const [profileUser, setProfileUser] = profile

  const [isEditMode, setIsEditMode] = useState(false)
  const [skills, setSkills] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")

  const [profileFields, setProfileFields] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    role: currentUser.role,
    department: currentUser.department,
    aboutMe: {
      text: currentUser.aboutMe.text,
      careerDevelopment: currentUser.aboutMe.careerDevelopment,
      skills: [currentUser.aboutMe.skills]
    },

    imageRef: currentUser.imageRef,
  })
console.log(currentUser)

  // This is the default list which doesn't change
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
          className="p-2 m-2 w-36 border rounded-lg text-xs border-gray-800 bg-green-300 text-black"
        >
          {skill}
        </button>
      )
    }

    // Function to update the skill list (in currentUser and userSkills state object)
    const updateUserSkills = (skill) => {
      if (currentUser.aboutMe.skills.includes(skill)) {
      if (skillList.includes(skill)) {
          currentUser.aboutMe.skills.splice(currentUser.aboutMe.skills.indexOf(skill), 1);
        } else {
          if (confirm(`This action will delete: "${skill}". Are you sure?`)) {
          currentUser.aboutMe.skills.splice(currentUser.aboutMe.skills.indexOf(skill), 1);
          }
        }
      } else {
        currentUser.aboutMe.skills.push(skill);
      }
      setUserSkills([...currentUser.aboutMe.skills])
    }

    const handleInputChange = (e, field) => {
      setProfileFields({ ...profileFields, [field]: e.target.value });
    }

    const handleAboutMeChange = (e, field) => {
      setProfileFields({ ...profileFields,
        aboutMe : {[field]: e.target.value }});
    }

  // Applications Dummy Data
  const applications = []

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
                onClick={updateProfile}
                className="bg-washed-blue text-white text-lg md:text-xl lg:text-lg p-4 rounded-lg shadow-md hover:bg-dark-blue"
              >
                {"Save Changes"}
              </button>
              <button
              type="submit"

              className="bg-red-600 hover:bg-white text-white text-lg md:text-xl lg:text-lg hover:text-red-600 m-2 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8 min-w-[8rem] border border-blue-500 hover:border-red-600 rounded-lg"
            >
              {"Cancel"}
            </button>
            </>
            :
              <button
                type="submit"
                onClick={() => setIsEditMode(true)}
                className="bg-washed-blue text-white p-4 rounded-lg shadow-md hover:bg-dark-blue"
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

  const addSkill = () => {
    if (newSkill) {
      setSkills([...skills, newSkill]);
      setNewSkill(""); // Clear input after adding
    }
  }

  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  }




  const updateProfile = async (event) => {
    event.preventDefault()


    setUserSkills([...currentUser.aboutMe.skills])

    const updatedProfile = {
      aboutMe: {
        text: profileFields.aboutMe.text,
        careerDevelopment: profileFields.aboutMe.careerDevelopment,
        skills: [...currentUser.aboutMe.skills]
      }
    }

    try {
      // const response = await fetch(`https://talent-forge-api-atu2.onrender.com/users/${currentUser._id}`, {
        const response = await fetch(`http://localhost:8002/users/${currentUser._id}`, {
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
           setIsEditMode(false)
           console.log(currentUser)
          } else {
            throw new Error(`Error: ${response.statusText}`)
          }
        } catch (error) {
          console.error('Failed to create/update listing:', error)

        }
      }





  return (
    <>
    {/* <form onSubmit={updateProfile}> */}
      {/* Div encapsulating/creating grid effect */}
      <div className="bg-blue-50 items-center justify-center mx-6 my-6 md:my-12 p-6 md:p-10 lg:p-16 xl:mx-40 px-5 lg:grid lg:grid-cols-3 lg:gap-4">
        {/* Div for first grid row */}
        <div className="flex justify-center items-center flex-col lg:flex-col lg:space-x-4 max-w-6xl mx-auto px-5">
          {/* First Column: Profile Image, Role, & Department */}
          <div
            className="flex flex-col sm:items-center sm:justify-center items-center max-w-lg mx-auto px-5
        md:flex md:items-center md:space-x-4 md:max-w-xl md:mx-auto md:px-5 lg:max-w-xl lg:mx-0 lg:px-5 "
          >

            <div className="flex flex-col items-center justify-center flex-1">
              {/* Edit Name */}
              {isEditMode ? (
                <div className="flex justify-center items-center mb-4 w-full">
                  <div className="mr-2">Name:</div>
                  <input
                    maxLength="30"
                    placeholder="(30 characters max)"
                    type="text"
                    value={`${profileFields.firstName} ${profileFields.lastName}`}
                    onInput={(e) => handleInputChange(e, "name")}
                    className="p-textarea-left text-input-class border border-gray-300 w-full"
                  />
                </div>
              ) : (
                <h2 className="text-2xl text-center font-bold mb-2">{`${profileFields.firstName} ${
                  profileFields.lastName
                }`}</h2>
              )}
              <div className="border-2 border-gray-800">
            <img src={profileFields?.imageRef} alt="Profile Photo" />
            </div>
              {/* Edit Role */}
              {isEditMode ? (
                <div className="flex items-center mb-4">
                  <div className="mr-2">Role:</div>
                  <input
                    type="text"
                    maxLength="20"
                    placeholder="(20 character max)"
                    value={profileFields.role}
                    onInput={(e) => handleInputChange(e, "role")}
                    className="p-textarea-left text-input-class flex-1 border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-xl">Role: {profileFields.role}</p>
              )}

              {/* Edit Department */}
              {isEditMode ? (
                 <div className="flex items-center  w-full">
                  <div className="mr-2">Department: </div>
                  <input
                    type="text"
                    maxLength="25"
                    placeholder="(25 character max)"
                    value={profileFields.department}
                    onInput={(e) => handleInputChange(e, "department")}
                    className="p-textarea-left text-input-class border border-gray-300"
                  />
                </div>
              ) : (
                <p className="text-xl">Department: {profileFields.department}</p>
              )}
            </div>
          </div>

          {/* Skills list */}
          {isEditMode ? (
            // If isEditMode is true, then display edit options
            <div className="flex justify-center items-center max-w-lg mx-auto px-5 flex-col">
              {" "}
              {/* Changed class to flex-col */}
              <div className="flex flex-wrap gap-2 items-center space-x-0.5 mt-10 px-5 flex-col">
                {" "}
                {/* Changed class to flex-col */}
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center flex-col">
                    {" "}
                    {/* Changed class to flex-col */}
                    <span className="bg-dark-green text-white px-4 py-2 rounded-md mb-2 font-medium">{skill}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="bg-red-500 text-white ml-2 px-2 py-1 rounded-md mb-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
              {/* Add new skill */}
              <div className="flex justify-center items-center max-w-lg mx-auto mt-10 px-5 flex-col"> {/* Added flex class */}
                <input
                  maxLength="15"
                  placeholder="(15 character max)"
                  type="text"
                  value={newSkill}
                  onInput={(e) => setNewSkill(e.target.value)}
                  className="p-textarea-left border rounded-md w-full"
                />
                <button
                  onClick={addSkill}
                  data-testid="add-skill-button"
                  className="bg-dark-green text-white shadow shadow-gray-300 px-4 py-2 rounded-md mt-2 self-center"

                >
                  Add Skill
                </button>
              </div>
            </div>
          ) : (
            // Else if false, simply display skills
            <div className="flex flex-wrap gap-2 items-center space-x-0.5 max-w-lg mx-auto mt-10 px-5">
              {/* Enumerate over each skill, creating a span for each one. */}
              {skills.map((skill, index) => (
                <span key={index} className="bg-dark-blue text-white px-4 py-2 rounded-md text-md font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Profile Description (About Me) */}
          {isEditMode ? (
            <div className="flex flex-col items-center justify-center w-full mx-auto mt-10 px-5 lg:mb-10">
            <label htmlFor="aboutMe" className="text-center mb-3 text-bold text-xl">
                About Me:
              </label>
              <textarea
                id="about-me-text"
                maxLength="220"
                placeholder="(220 character max)"
                value={profileFields.aboutMe.text}
                onInput={(e) => handleAboutMeChange(e, "text")}
                className="p-textarea-left text-input-class w-full h-56 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center max-w-lg mx-auto mt-10 px-5 lg:mb-10">
              <h2 className="text-2xl text-center font-bold mb-2">About Me</h2>
              <p className="text-xl">{profileFields.aboutMe.text}</p>
            </div>
          )}
          {/* END OF FIRST COLUMN DIV */}
        </div>

        {/* Divider */}
        <hr className="border-b border-gray-900 my-10 w-2/3 mx-auto max-w-md lg:hidden" />

        {/* Div for second grid row */}
        <div className="flex flex-col justify-center items-center lg:flex-col lg:space-x-4 max-w-6xl mx-auto mt-10 mb-10 px-5 ">
          {/* Checkboxes (Radio Buttons) */}
          <div
            className={`flex ${isEditMode ? "flex-col" : ""} ${isEditMode ? "w-full" : "max-w-lg"} mx-auto mt-10 ${
              isEditMode ? "" : "px-5"
            }`}
          >
            {isEditMode ? (
              <div className="flex flex-col justify-center items-center w-full mx-auto mt-10 ">
                {/* Show user skills first (in green) */}
                {userSkills.map((skill, index) => showUserSkills(skill, index))}
                {/* Show any remaining default skills (in blue)*/}

                {skillList.map((skill, index) => {
                  if (userSkills.includes(skill) === false) {
                    return (
                      <button onClick={() => updateUserSkills(skill)}
                      key={index}
                      className="p-2 m-2 w-36 border rounded-lg text-xs border-gray-800 bg-dark-green text-white"
                      >
                      {skill}
                      </button>
                    )
                  }
                })}
              <div className="flex justify-center items-center max-w-lg mx-auto mt-10 px-5 flex-col"> {/* Added flex class */}
                <input
                  maxLength="15"
                  placeholder="(15 character max)"
                  type="text"
                  value={newSkill}
                  onInput={(e) => setNewSkill(e.target.value)}
                  className="p-textarea-left border rounded-md w-full"
                />
                <button
                  onClick={addSkill}
                  data-testid="add-skill-button"
                  className="bg-dark-green text-white shadow shadow-gray-300 px-4 py-2 rounded-md mt-2 self-center"

                >
                  +
                </button>
              </div>



              </div>
            ) : (
              // Displays skills on main profile page (userSkills state has not yet been set on first rendering profile)
              <div className="flex flex-col justify-center items-center mb-12">
                {currentUser.aboutMe.skills.map((index, skill) => showUserSkills(index, skill))}
              </div>
            )}
          </div>

          {/* Career Development Description */}
          <div
            className={`flex ${isEditMode ? "flex-col" : ""} ${isEditMode ? "w-full" : "max-w-lg"} mx-auto mt-10 ${
              isEditMode ? "px-5" : ""
            } justify-center items-center`}
          >
            {isEditMode ? (
              <div className="w-full mx-auto mt-10 px-5 flex flex-col items-center">
                {" "}
                {/* Added items-center class */}
                <label htmlFor="aboutMe" className="text-center mb-3 text-xl font-bold">
                  Career Development:
                </label>
                <textarea
                  id="about-me-career-development"
                  maxLength="220"
                  placeholder="(220 character max)"
                  value={profileFields.aboutMe.careerDevelopment}
                  onInput={(e) => handleAboutMeChange(e, "careerDevelopment")}
                  className="text-input-class w-full h-56 p-2 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" // Tailwind classes to adjust width and height
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl text-center font-bold mb-2">Career Development</h2>
                <p className="text-xl text-center">{profileFields.aboutMe.careerDevelopment}</p>
              </div>
            )}
          </div>
          {/* END OF SECOND COLUMN DIV */}
        </div>
        {/* Div for third grid row */}
        <div className="flex flex-col lg:flex-col lg:space-x-4 max-w-6xl mx-auto mt-10 mb-10 px-5 ">
          {/* List of Applications Can applications be rendered using opportunities.jsx ? */}
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
          </div>

          {/* Edit Button */}
          <EditButtonRender Auth={Auth(profileUser._id, currentUser)}/>
          {/* END OF THIRD COLUMN DIV */}
        </div>
        {/* End of div encapsulating/creating grid effect */}
      </div>
      {/* </form> */}
    </>
  )
}

export default Profile;
