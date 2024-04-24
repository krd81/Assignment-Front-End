import { useState, useContext } from "react"
import { AppContext } from '../authentication/AppContext'
import { useParams, useNavigate } from "react-router-dom"

// NewListing component serves the purpose of creating a new listing (/listing-new)
// and also editing an existing listing (/listing-edit/:id)

const NewListing = () => {
    document.title = "Create Listing";
    const { loggedInUser, listing } = useContext(AppContext)
    const [ currentUser ] = loggedInUser
    const [ currentListing ] = listing
    const {id} = useParams()
    const nav = useNavigate()
    // let editMode = false
    // Add local state object to store all of the form's input fields and
    // create a function which will handle changes made the user

    const today = new Date(Date.now())
    const day = today.toISOString().slice(8,10)
    const month = today.toISOString().slice(5,7)
    const year = today.toISOString().slice(0,4)
    // date useState controls the date posted field, initially setting it as today's date, unless changed by the user
    const [date, setDate] = useState(`${year}-${month}-${day}`)

    const [listingFields, setListingFields] = useState({
        title: (editMode && currentListing)? currentListing.title : '',
        description:{
          points: (editMode && currentListing)? currentListing.description.points : ['', '', ''],
          text: (editMode && currentListing)? currentListing.description.text : ''
        },
        department: (editMode && currentListing)? currentListing.department : '',
        location: (editMode && currentListing)? currentListing.location : 'On Site',
        roleType: (editMode && currentListing)? currentListing.roleType : 'Full-time',
        roleDuration: (editMode && currentListing)? currentListing.roleDuration : 'Permanent',
        salary: (editMode && currentListing)? currentListing.salary : '',
        datePosted: (editMode && currentListing)? currentListing.datePosted : date,
        dateClosing: (editMode && currentListing)? currentListing.dateClosing : '',
        listingActive: (editMode && currentListing)? currentListing.listingActive : true
      })

  const handleInputChange = (e, field) => {
    setListingFields({...listingFields, [field]: e.target.value})
  }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const formDataObj = Object.fromEntries(formData.entries())
        console.log(formData)
        console.log(formDataObj)
        const listingData = {
          title: formDataObj.title,
          description: {
            points: [formDataObj.bullet1, formDataObj.bullet2, formDataObj.bullet3],
            text: formDataObj.jobDescription
          },
          department: formDataObj.department,
          location: formDataObj.location,
          roleType: formDataObj.roleType,
          roleDuration: formDataObj.roleDuration,
          salary: formDataObj.salary,
          datePosted: formDataObj.datePosted,
          dateClosing: formDataObj.dateClosing,
          listingActive: formDataObj.listingActive,
          creator: currentUser
        }

        let url = 'http://localhost:8002/listings';
        let method = 'POST';

        if (editMode && currentListing) {
          url += `/${id}`
          method = 'PUT'
        }


        try {
          // const response = await fetch('https://talent-forge-api-atu2.onrender.com/listings', {
          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(listingData),
          })
          console.log({'response': response, 'method': method})

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`)
          }


          if (editMode && currentListing) {
            // Change link to navigate back to 'manage listings' version of listing
            // enabling user to make further edits if required
            nav(`/listings/${id}`)
          } else {
            nav('/home')
            // Find a way to obtain the listingID of the newly created listing and navigate to page
            // nav(`/listings/`)
          }

        } catch (error) {
          console.error('Failed to create new listing:', error)

        }
      }

  function editMode() {
    if (id) {
      return true
    } else {
      return false
    }
  }

  const handleCancel = () => {
    if (confirm("Are you sure?")) {
      nav(`/opportunities/${currentUser._id}`)
    }
  }



  return (
    <>
    <form onSubmit={handleSubmit}>
      <div className="bg-white mx-6 my-6 md:my-12 lg:my-24 p-6 md:p-10 lg:p-16 xl:mx-12">
        <div className="flex flex-col items-center">
          {/* Title */}
          <div className="flex justify-center lg:justify-start pb-4">
            <h1 className="text-center text-4xl lg:text-5xl font-bold">{(editMode && currentListing) ? "Edit Listing" : "Create new listing"}</h1>
          </div>
          {/* Form: job title/dept/date */}
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-1/2">
            <br />
              <div className="flex flex-row md:items-center">
                <label htmlFor="role-input" className="w-1/2 md:w-1/3 text-left md:text-2xl lg:text-3xl md:mr-4">
                  Job title:
                </label>
                <input
                  type="text"
                  id="role-input"
                  name="title"
                  value={listingFields.title}
                  onInput={(e) => handleInputChange(e, "title")}

                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-row md:items-center">
                <label htmlFor="dept-input" className="w-1/2 md:w-1/3 text-left md:text-2xl lg:text-3xl md:mr-4">
                  Department:
                </label>
                <input
                  type="text"
                  id="dept-input"
                  name="department"
                  value={listingFields.department}
                  onInput={(e) => handleInputChange(e, "department")}
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-row md:items-center">
                <label htmlFor="dept-input" className="w-1/2  md:w-1/3 text-left md:text-2xl lg:text-3xl md:mr-4">
                  Salary:
                </label>
                <input
                  type="text"
                  id="dept-input"
                  name="salary"
                  value={listingFields.salary}
                  onInput={(e) => handleInputChange(e, "salary")}
                  className="p-textarea-left form-input w-full md:w-2/3 lg:w-3/4 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <br />
              <div className="flex flex-row md:items-center">
                <label htmlFor="closing-date-input" className="w-1/2 md:w-1/3 lg:w-1/3 text-left md:text-2xl lg:text-3xl md:mr-4">
                  Posting date:
                </label>
                <input
                  type="date"
                  id="posted-date-input"
                  name="datePosted"
                  className="p-textarea-left form-input w-1/2 md:w-36 lg:w-3/4 block rounded-md border-2 border-black  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={listingFields.datePosted}
                  onChange={(e) => handleInputChange(e, "datePosted")}
                  // If date is blank, setDate defaults to today
                  // onChange={e => setDate(e.target.value)}
                />

              </div>
              <br />
              <div className="flex flex-row md:items-center">
                <label htmlFor="closing-date-input" className="w-1/2 md:w-1/3 lg:w-1/3 text-left md:text-2xl lg:text-3xl md:mr-4">
                  Closing date:
                </label>
                <input
                  type="date"
                  id="closing-date-input"
                  name="dateClosing"
                  value={listingFields.dateClosing}
                  onInput={(e) => handleInputChange(e, "dateClosing")}
                  className="p-textarea-left form-input w-1/2 md:w-36 lg:w-3/4 block rounded-md border-2 border-black  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
          </div>

          {/* div controlling radio elements  */}
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-1/2 mt-8 md:flex md:justify-between">
            {/*Hours Type - Fulltime/parttime  */}
            <div className="py-2 md:w-1/3">
              <ul className="space-y-2 text-lg md:text-2xl">
                <legend className="text-xl lg:text-2xl font-bold">Role Basis:</legend>
                <div>
                  <li>
                    <label htmlFor="fulltime-input" className="inline-flex items-center">
                      <input type="radio"
                      id="fulltime-input"
                      name="roleType"
                      value="Full Time"
                      checked = {listingFields.roleType === "Full-time"}
                      onChange={e => handleInputChange(e, "roleType")}/>
                      <span className="ml-3">Full Time</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="parttime-input" className="inline-flex items-center">
                      <input type="radio"
                      id="parttime-input"
                      name="roleType"
                      value="Part Time"
                      checked = {listingFields.roleType === "Part Time"}
                      onChange={e => handleInputChange(e, "roleType")}/>
                      <span className="ml-3">Part Time</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="other-input" className="inline-flex items-center">
                      <input type="radio"
                      id="other-input"
                      name="roleType"
                      value="Other"
                      checked = {listingFields.roleType === "Other"}
                      onChange={e => handleInputChange(e, "roleType")}/>
                      <span className="ml-3">Other</span>
                    </label>
                  </li>
                </div>
              </ul>
            </div>

            {/* Permanent/contract etc */}
            <div className="py-3 border-t-2 border-dotted md:w-1/3">
              <ul className="space-y-2 text-lg md:text-2xl">
                <legend className="text-xl lg:text-2xl font-bold">Role type:</legend>
                <div>
                  <li>
                    <label htmlFor="permanent-input" className="inline-flex items-center">
                      <input type="radio"
                      id="permanent-input"
                      name="roleDuration"
                      value="Permanent"
                      checked = {listingFields.roleDuration === "Permanent"}
                      onChange={e => handleInputChange(e, "roleDuration")}/>
                      <span className="ml-3">Permanent</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="contract-input" className="inline-flex items-center">
                      <input type="radio"
                      id="contract-input"
                      name="roleDuration"
                      value="Contract"
                      checked = {listingFields.roleDuration === "Contract"}
                      onChange={e => handleInputChange(e, "roleDuration")}/>
                      <span className="ml-3">Contract</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="parental-input" className="inline-flex items-center">
                      <input type="radio"
                      id="parental-input"
                      name="roleDuration"
                      value="Parental Leave Cover"
                      checked = {listingFields.roleDuration === "Parental Leave Cover"}
                      onChange={e => handleInputChange(e, "roleDuration")}/>
                      <span className="ml-3">Parental Leave Cover</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="secondment-input" className="inline-flex items-center">
                      <input type="radio"
                      id="secondment-input"
                      name="roleDuration"
                      value="Secondment"
                      checked = {listingFields.roleDuration === "Secondment"}
                      onChange={e => handleInputChange(e, "roleDuration")}/>
                      <span className="ml-3">Secondment</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="other-input" className="inline-flex items-center">
                      <input type="radio"
                      id="other-input"
                      name="roleDuration"
                      value="Other"
                      checked = {listingFields.roleDuration === "Other"}
                      onChange={e => handleInputChange(e, "roleDuration")}/>
                      <span className="ml-3">Other</span>
                    </label>
                  </li>
                </div>
              </ul>
            </div>

            {/*Location: on site etc */}
            <div className="py-3 border-t-2 border-dotted md:w-1/3">
            <ul className="space-y-2 text-lg md:text-2xl">
                <legend className="text-xl lg:text-2xl font-bold">Role location:</legend>
                <div>
                  <li>
                    <label htmlFor="onsite-input" className="inline-flex items-center">
                      <input type="radio"
                      id="onsite-input"
                      name="location"
                      value="On Site"
                      checked = {listingFields.location === "On Site"}
                      onChange={e => handleInputChange(e, "location")}/>
                      <span className="ml-3">On Site</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="hybrid-input" className="inline-flex items-center">
                      <input type="radio"
                      id="hybrid-input"
                      name="location"
                      value="Hybrid"
                      checked = {listingFields.location === "Hybrid"}
                      onChange={e => handleInputChange(e, "location")}/>
                      <span className="ml-3">Hybrid</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="other-input" className="inline-flex items-center">
                      <input type="radio"
                      id="other-input"
                      name="location"
                      value="Other"
                      checked = {listingFields.location === "Other"}
                      onChange={e => handleInputChange(e, "location")}/>
                      <span className="ml-3">Other</span>
                    </label>
                  </li>
                </div>
              </ul>
            </div>
          </div>

          {/* Description */}
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-1/2 border-t-2 border-dotted mt-8">
          <label htmlFor="job-desc-bullet1" className="font-bold text-xl lg:text-2xl leading-tight text-blue-gray-400">
          Bullet Points (include up to 3 key attributes or points about the role):
            </label>
            <div className="flex my-3">
              <label className="text-xs py-4 md:py-2 pr-4">⚫️</label>
            <textarea
                name="bullet1"
                id="bullet-desc-input"
                className="p-textarea-left form-input w-full md:h-8 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                // defaultValue={`${listingFields.description.points?.[0]}` | ''}
                defaultValue={`${listingFields.description.points?.[0]}`}
                onInput={(e) => handleInputChange(e, "description")}
            ></textarea>
              </div>
              <div className="flex my-3">
              <label className="text-xs py-4 md:py-2 pr-4">⚫️</label>
            <textarea
                name="bullet2"
                id="bullet-desc-input"
                className="p-textarea-left form-input w-full md:h-8 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                // defaultValue={`${listingFields.description.points?.[1]}` | ''}
                defaultValue={`${listingFields.description.points?.[1]}`}
                onInput={(e) => handleInputChange(e, "description")}
            ></textarea>
              </div>
              <div className="flex my-3">
              <label className="text-xs py-4 md:py-2 pr-4">⚫️</label>
            <textarea
                name="bullet3"
                id="bullet-desc-input"
                // defaultValue={`${listingFields.description.points?.[2]}` | ''}
                defaultValue={`${listingFields.description.points?.[2]}`}
                onInput={(e) => handleInputChange(e, "description")}
              className="p-textarea-left form-input w-full md:h-8 block rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
              </div>
          </div>
          <div className="w-full md:w-4/5 lg:w-3/4 xl:w-1/2 border-t-2 border-dotted mt-8">
            <br />
              <label htmlFor="job-desc-input" className="font-bold text-xl lg:text-2xl leading-tight text-blue-gray-400">
                Job description:
              </label>
              <textarea
                name="jobDescription"
                id="job-desc-input"
                className="p-textarea-left form-input text-xl w-full h-80 block overflow-y-auto my-2 rounded-md border-2 border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder-gray-400 placeholder-shown:text-sm placeholder-shown:leading-[3.75] "
                defaultValue={`${listingFields.description.text}`}
                onInput={(e) => handleInputChange(e, "description")}
            ></textarea>

          </div>

{/* On/Off Slider */}
            <div className="inline-flex items-center justify-end my-3 md:my-3 lg:my-3">
                <label htmlFor="listing-active"
                  className="mt-px mb-0 mr-10 text-lg md:text-2xl lg:text-3xl">
                  Active on site:
                </label>
                <div className="relative inline-block w-28 h-8 content-center rounded-full cursor-pointer">
                  <input id="listing-active"
                    type="checkbox"
                    name="listingActive"
                    // value={listingFields.listingActive}
                    checked = {listingFields.listingActive === true}
                    onInput={(e) => handleInputChange(e, "listingActive")}
                      // colouration of on portion and off portion - duration of movement of slider
                    className="absolute bottom-1 w-10 h-6 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-gray-500 checked:bg-green-500  peer-checked:border-gray-900 peer-checked:before:bg-blue-500"
                  />
                  <label htmlFor="listing-active"
                    // slider marker size/colour
                    className="before:content[''] absolute top-2.5 -left-1 h-6 w-6 -translate-y-1/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-gray-900 peer-checked:before:bg-gray-900">
                  </label>
                </div>
            </div>


          {/* Buttons */}
          <div className="flex justify-center mt-6">
            <div className="flex flex-col">
              <button
                type="submit"
                className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-lg md:text-xl lg:text-lg hover:text-white m-2 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8 min-w-[8rem] border border-blue-500 hover:border-transparent rounded"
              >
                Save
              </button>
              <button onClick={handleCancel}
                type="submit"
                className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-lg md:text-xl lg:text-lg hover:text-white m-2 py-2 md:py-3 lg:py-4 px-5 md:px-6 lg:px-8 min-w-[8rem] border border-blue-500 hover:border-transparent rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      </form>

    </>
  )
}

export default NewListing
