import { useContext } from "react"
import "../assets/css/ViewListing.css"
import { AppContext } from '../authentication/AppContext'
import { useParams, useNavigate } from "react-router-dom"



const ViewListing = () => {
  const { listing } = useContext(AppContext)
  const [ currentListing ] = listing
  const { viewtype } = useParams()
  const nav = useNavigate()

  // Conditional rendering of job description/points
  function renderJobInfo(info) {
    console.log(currentListing)
    if (currentListing.description) {
        if (info ==='points' && currentListing.description.points) {
          const pointsArray = [...currentListing.description.points]
          return pointsArray.map((point, index) => {
            return <li className="text-lg md:text-xl lg:text-2xl my-1 md:my-3" key={index}>{point}</li>
          })
        } else if (info === 'text' && currentListing.description.text) {
          return <p className="text-xl md:text-2xl lg:text-2xl">{currentListing.description.text}</p>
        }
    } else {
      return null
    }
  }

  const dateFormat = (date) => {
    // DB stores date as YYYY-MM-DD
    const dateFormatted = new Date(date)
    const day = dateFormatted.toISOString().slice(8,10)
    const month = dateFormatted.toISOString().slice(5,7)
    const year = dateFormatted.toISOString().slice(0,4)
    return `${day}/${month}/${year}`
  }


  // Functionality to apply for role
  // const handleApplyButton = () => {
  //   // No preceding '/' makes the path relative and redirects to apply page
  //   nav('apply')
  // }




  document.title = "View Listing"


  return (
    <>
      <div className="flex justify-center md:p-8 lg:p-4 xl:p-12 bg-grey ">
        <div className="bg-blue-50 border-2 border-gray-700 shadow-2xl my-6 mx-6 px-4 md:px-28 lg:px-96">
          {/* Listing header */}
          <div className="flex justify-center pt-4 lg:pt-10 lg:pb-4 ">
            <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold">{currentListing.title}</h1>
          </div>
          {/* Listing subheader */}
          <div className="flex justify-center">
            <h2 className="text-2xl md:text-2xl lg:text-3xl">{`Department: ${currentListing.department}`}</h2>
          </div>
          <div className="flex justify-center items-center flex-col sm:flex-col md:flex-col lg:flex-row">
            {/* Listing top level info */}
            <div className="top-level-info mx-2 sm:mx-4 md:mx-4 lg:mx-4 my-2 md:my-4 lg:my-4">

              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
                {currentListing.location}
              </h4>

              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
              {currentListing.roleType}
              </h4>

              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
              {currentListing.roleDuration}
              </h4>
              <h4 className="info-title text-lg md:text-xl lg:text-2xl flex justify-start pt-2">
              {`Date Posted: `}{currentListing ? dateFormat(currentListing.datePosted) : "Loading..."}
              </h4>

            </div>
            </div>

            <div className="flex justify-center items-center flex-col sm:flex-col md:flex-col lg:flex-row">
            {/* Job points */}
            <div className="job-points mx-7 md:mx-11 lg:mx-11 my-0 md:my-4 lg:my-4">
              <div className="list-disc list-inside text-lg md:text-3xl lg:text-3xl">
            {/* Bullet point rendering function */}
                {renderJobInfo('points')}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center mx-2 md:mx-4 lg:mx-4 my-0 md:my-2 lg:my-2">
            {/* Full job description */}
            <div>
              <span  id="para">
                {renderJobInfo('text')}
              </span>
            </div>
          </div>

          {/* Edit/Delete buttons OR Apply Now button */}
          {viewtype ?
            <>

          <div className="flex flex-wrap justify-center my-3">
            <button onClick={() => nav('edit')}
            type="submit"
            className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-white m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded"
          >
            Edit
          </button>

            <button onClick
            type="submit"
            className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-white m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded"
            >
            Delete
            </button>
            </div>
            </>
            :
            <div className="flex justify-center my-3">
            <button onClick={() => nav('apply')}
              type="submit"
              className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-white m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded"
            >
              Apply Now
            </button>
            </div>
            }

          {/* Closing date */}
          <div className="flex justify-center my-3 pb-6 italic ">
            <p className="text-lg md:text-2xl lg:text-2xl text-red-500">Closing Date: {dateFormat(currentListing.dateClosing)}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewListing;
