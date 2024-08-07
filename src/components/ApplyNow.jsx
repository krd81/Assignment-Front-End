import { useContext } from "react"
import "../assets/css/ViewListing.css"
import { AppContext } from '../authentication/AppContext'
import { useNavigate } from "react-router-dom"



const ApplyNow = () => {
    const { listing, loggedInUser } = useContext(AppContext)
    const [currentListing, setCurrentListing] = listing
    const [currentUser, setCurrentUser] = loggedInUser // currentUser is set in AppContextProvider
    const nav = useNavigate()
    // let wordCountOk = false
    let managerApproval = false


    function checkWordCount() {
      const textarea = document.getElementById('applicant-input');
      const words = textarea.value.split(/\s+/).filter(word => word !== ''); // Splitting by whitespace characters
      const wordCount = words.length;

      if (wordCount > 300) {
        alert("Word count exceeds 300. Please limit your input.");
      } else {
        return true
      }
    }

    // function managerApproval() {
    //   const checkbox = document.getElementById('manager-approval')

    //   if (!checkbox.checked) {
    //     alert("Please check the checkbox for manager approval.");
    //     event.preventDefault(); // Prevent form submission
    //   }
    // }


    function handleSubmit(event) {
      const checkbox = document.getElementById('manager-approval')

      if (!checkbox.checked) {
        alert("Please check the checkbox for manager approval.");
        event.preventDefault(); // Prevent form submission
      } else {
        managerApproval = true
      }

      // Check word count and manager approval ticked
      // while (!managerApproval) {
      //     alert('You must have your line manager\'s approval to apply for this role.')
      // }
      if (checkWordCount() && managerApproval) {
        postApplication(event)

      }
    }



    const postApplication = async (event) => {
        event.preventDefault()
        // const formData = new FormData(event.currentTarget)
        // const formDataObj = Object.fromEntries(formData.entries())

        // let applicants = [...currentListing.applicants, currentUser]
        const updateListing = {
          applicants: [...currentListing.applicants, currentUser]
        }

        const updateUser = {
          applications: [...currentUser.applications, currentListing]
        }

        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          const listingResponse = await fetch(`${apiUrl}/listings/${currentListing._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(updateListing), // This adds the user to the applicant array in the listing
          })

            const userResponse = await fetch(`${apiUrl}/users/${currentUser._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
              },
              body: JSON.stringify(updateUser), // This adds the user to the applicant array in the listing
            })


          if (!listingResponse.ok || !userResponse.ok) {
            throw new Error(`Error: ${listingResponse.statusText}`)
          }

          const result = await listingResponse.json()
          alert('Success! A confirmation email has been sent to you.')


          nav("/home")

        } catch (error) {
          console.error('Failed to complete application:', error)

        }
      }


    return (
        <>
        {/* <form onSubmit={handleSubmit}> */}
          <div className="">
            <div className="bg-blue-50 border border-gray-300 mx-6 my-6 md:my-12  p-6 md:px-24 lg:px-32 xl:mx-32 max-w-full">
              {/* Listing header */}
              <div className="flex justify-center pt-4 lg:pt-10 lg:pb-4">
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold">{currentListing.title}</h1>
              </div>
              {/* Listing subheader */}
              <div className="flex justify-center">
                <h2 className="text-2xl md:text-4xl lg:text-4xl">{currentListing.department}</h2>
              </div>
              <div className="flex flex-col sm:flex-col md:flex-col">
                {/* User's info */}
                <div className="top-level-info mx-2 sm:mx-4 md:mx-4 lg:mx-4 my-2 md:my-4 lg:my-2">
                  <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
                  {`Name: ${currentUser.firstName} ${currentUser.lastName}`}
                  </h4>
                </div>
                <div className="top-level-info mx-2 sm:mx-4 md:mx-4 lg:mx-4 my-2 md:my-4 lg:my-2">
                  <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
                  {`Current Role: ${currentUser.role}`}
                  </h4>
                </div>
                <div className="top-level-info mx-2 sm:mx-4 md:mx-4 lg:mx-4 my-2 md:my-4 lg:my-2">
                  <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
                  {`Current Department: ${currentUser.department}`}
                  </h4>
                </div>
              </div>
                {/* Info */}

              <div className="flex flex-col justify-center mx-2 md:mx-4 lg:mx-4 my-4 md:my-6 lg:my-6">
                <div className="mx-0 my-2 md:my-4 lg:my-4">
                    <p className="text-lg md:text-2xl">Thank you for your interest in the role of {currentListing.title} in the {currentListing.department} department. <br/>
                    Please use the space below to write a brief statement explaining your suitability for the role. This will be sent to the hiring manager.<br/>
                    Best of luck!</p>
                    <div className="lg:flex lg:justify-center">
                <div className="w-full lg:w-3/4 border-t-2 border-dotted mb-6 ">
                    <br />
                    <textarea
                        name="description"
                        id="applicant-input"
                        className="p-textarea-left form-input text-xl w-full h-80 block overflow-y-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder-gray-400 placeholder-shown:text-sm placeholder-shown:leading-[3.75] ">
                    </textarea>
                    <label htmlFor="job-desc-input" className="font-normal leading-tight text-blue-gray-400 md:text-2xl"> 300 word limit</label>
                </div>
                </div>
                <div className="lg:flex lg:justify-center">
                    <label htmlFor="manager-approval" className="inline-flex items-baseline">
                      <input type="checkbox" id="manager-approval" />
                      <span className="ml-3 text-lg md:text-2xl">I have my line manager&#39;s consent to apply</span>
                    </label>
                </div>
                </div>
              </div>
              {/* Send/Cancel buttons */}
              <div className="md:flex  md:justify-center">
              <div className="grid grid-cols-1 place-content-center my-3 ">
                <button onClick={(e) => handleSubmit(e)}
                  type="submit"
                  className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-white m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded"
                >
                  Send
                </button>
                <button onClick={() => window.history.back()}
                  type="submit"
                  className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-white m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded"
                >
                  Cancel
                </button>
              </div>
              </div>
              {/* Closing date */}
            </div>
          </div>
          {/* </form> */}
        </>
      )
    }


export default ApplyNow