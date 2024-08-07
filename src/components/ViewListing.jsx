import { useContext, useEffect, useState } from "react"
import "../assets/css/ViewListing.css"
import IonIcon from '@reacticons/ionicons'
import { AppContext } from '../authentication/AppContext'
import { useParams, useNavigate, useLocation } from "react-router-dom"
import OpportunitiesByCreator from "./OpportunitiesByCreator"
import dateFormat from "../misc/dateFormat"


const ViewListing = () => {
  const { profile, loggedInUser, listing } = useContext(AppContext);
  const [ profileUser, setProfileUser ] = profile;
  const [currentUser, setCurrentUser] = loggedInUser;
  const [ currentListing ] = listing;
  const [favourites, setFavourites] = useState(null);
  const { viewtype } = useParams();
  const nav = useNavigate();
  const location = useLocation();
  const isExpired = location.state?.isExpired;
  console.log(currentUser)

  // Conditional rendering of job description/points
  function renderJobInfo(info) {
    console.log(currentListing)
    if (currentListing?.description) {
        if (info ==='points' && currentListing?.description.points) {
          const pointsArray = [...currentListing.description.points]
          return pointsArray.map((point, index) => {
            return <li className="text-lg md:text-xl lg:text-2xl my-1 md:my-3 list-item-indent" key={index}>{point}</li>
          })
        } else if (info === 'text' && currentListing?.description.text) {
          return <p className="text-xl md:text-2xl lg:text-2xl">{currentListing?.description.text}</p>
        }
    } else {
      return null
    }
  }

    //useEffect hook allows the favourites state to be updated once the current user object becomes available
    useEffect(() => {
      if (currentUser && currentUser.listingsFavourites) {
        setFavourites([...currentUser.listingsFavourites]);
      }
    }, [currentUser]);



  const displayFavouriteIcon = () => {
    if (favourites) {
      // Find and add to isFavourite if the current listing is in favourites
      let isFavourite = favourites.find(favourite => favourite._id === currentListing._id);

      // Set iconName based on whether the listing is a favourite or not
      // isFavourite is either defined (as the found listing) or undefined
      const iconName = isFavourite ? "star" : "star-outline";
      const iconColour = isFavourite ? "text-yellow-400" : "text-gray-300";

      return (
        <>
          <a className={`md:p-1 ${iconColour}`} onClick={event => toggleFavourite(event)}>
            <IonIcon name={iconName} size="large" />
          </a>
        </>
      );
    }

  }

  const toggleFavourite = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Stop the event from propagating to parent elements
    }

    if (favourites.length > 0) {
      if (favourites.find(favourite => favourite._id === currentListing._id)) {
        setFavourites(prev => prev.filter(prevListing => prevListing._id !== currentListing._id));
      } else {
        setFavourites([...favourites, currentListing]);
      }
    } else {
      setFavourites([currentListing]);
    }
  }

  useEffect(() =>  {
    const updateUserFavourites = async () => {
      // If favourites is null (i.e. on initial mount, do not update the database)
      if (favourites) {
        const favouritesUpdate = {
          listingsFavourites: favourites.length > 0 ? [...favourites] : []
        };

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        await fetch (`${apiUrl}/users/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          },
          body: JSON.stringify(favouritesUpdate)
        });
      } catch (error) {
        console.error('User\'s favourite listings not updated:', error);
      }
    }
   }
   if (currentUser) {
    updateUserFavourites();
   }
  }, [favourites, currentUser]);

  function handleApply() {
    if ((currentUser &&
      currentUser.applications.find(application => application._id === listing._id) &&
        confirm("You have already applied for this role. Are you sure you would like to continue?")
      ) || (currentUser &&
        !currentUser.applications.find(application => application._id === listing._id))) {
          nav('apply') // No preceding / makes the path relative and redirects to apply page
    }
  }

  const showApplicants = () => {
    if (currentUser._id === currentListing?.creator._id) {
      return (
        <>
          <div className="text-3xl font-bold pb-4">
            Applicants:
          </div>
          {currentListing?.applicants.length > 0 ?
          currentListing?.applicants.map(applicant =>
            <div key={applicant._id} className="text-xl px-4 pb-1">
              <ul>
                <li className="list-disc">
                  <div className="flex">
                    <a className="applicant-link" onClick={() => showApplicantProfile(applicant)}>{applicant.firstName} {applicant.lastName}</a>
                    <p className="text-xl pl-2">- {applicant.department}</p>
                  </div>
                </li>
              </ul>
            </div>
            )
            :
            <p className="text-gray-500 text-2xl font-semibold px-0 pt-4 pb-1">
              No applicants to show
            </p>
            }
        </>
      )
    }
  }

  const showApplicantProfile = (applicant) => {
    setProfileUser(applicant)
    console.log(applicant)
    nav(`/profile/${applicant._id}`)

  }

  document.title = "View Listing"


  return (
    <>
      <div className="flex justify-center md:p-8 lg:p-4 xl:p-12">
        <div className="bg-blue-50 border-2 border-gray-700 shadow-2xl w-full">
          {/* Listing header */}
          <div className="flex justify-between items-center pt-4 px-10 lg:pt-10 lg:pb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center flex-1 pl-10">{currentListing?.title}</h1>
            <div className="flex items-center text-3xl">
              {displayFavouriteIcon()}
            </div>
          </div>
          {/* Listing subheader */}
          <div className="flex justify-center">
            <h2 className="text-2xl md:text-2xl lg:text-3xl">{`Department: ${currentListing?.department}`}</h2>
          </div>

          <div className="my-6 mx-6 px-4 md:px-28 lg:px-80">
          <div className="flex justify-center md:items-center flex-col sm:flex-col md:flex-col lg:flex-row ">
            {/* Listing top level info */}
            <div className="top-level-info mx-2 sm:mx-4 md:mx-4 lg:mx-4 my-2 md:my-4 lg:my-4">

              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
                {currentListing?.location}
              </h4>

              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
              {currentListing?.roleType}
              </h4>

              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
              {currentListing?.roleDuration}
              </h4>
              <h4 className="info-title text-lg md:text-3xl lg:text-3xl flex justify-start pt-2">
                Salary: ${Number(currentListing?.salary).toLocaleString()}
              </h4>
              <h4 className="info-title text-lg md:text-xl lg:text-2xl flex justify-start pt-2">
              {`Date Posted: `}{currentListing ? dateFormat(currentListing?.datePosted) : "Loading..."}
              </h4>

            </div>
            </div>

            <div className="flex md:justify-center md:items-center flex-col pt-4 md:pt-0 sm:flex-col md:flex-col lg:flex-row">
            {/* Job points */}
            <div className="job-points mx-2 md:mx-11 lg:mx-11 my-0 md:my-4 lg:my-4">
              <div className="list-disc list-inside text-lg md:text-3xl lg:text-3xl">
            {/* Bullet point rendering function */}
                {renderJobInfo('points')}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center mx-2 md:mx-4 lg:mx-4 my-6 md:my-2 lg:my-2 test-text">
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
            {/* relative navigation - adds /edit to the end of the current address */}
            <button onClick={() => nav('edit')}
            // e.g. http://localhost:5173/listings/creator/662502e5ad88aad21dd7ca9a/edit
            type="submit"
            className="bg-dark-green hover:bg-dark-blue text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-white m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded"
          >
            Edit
          </button>

            <button onClick={() => OpportunitiesByCreator.handleDelete(currentListing)}
            type="submit"
            className="bg-red-600 hover:bg-white text-white font-semibold text-2xl md:text-3xl lg:text-4xl hover:text-red-600 m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300  hover:border-red-600 rounded"
            >
            Delete
            </button>
            </div>
            </>
            :
            <div className="flex justify-center my-3">
            <button onClick={() => {
              if (!isExpired) {
                handleApply();
              }
            }}
              type="submit"
              className={`${isExpired ? "bg-gray-300 text-gray-400 cursor-default expired-button" : "bg-dark-blue text-white" } font-semibold text-2xl md:text-3xl lg:text-4xl  m-2 py-1 px-5 h-12 lg:h-14 min-w-64 max-w-80 border border-gray-300 hover:border-transparent rounded`}
            >
              Apply Now
            </button>
            </div>
            }

          {/* Closing date */}
          <div className="flex justify-center my-3 pb-6 italic ">
            <p className="text-lg md:text-2xl lg:text-2xl text-red-500">Closing Date: {dateFormat(currentListing?.dateClosing)}</p>
          </div>
          {showApplicants()}
          </div>
        </div>
      </div>
    </>
  )
}

export default ViewListing;
