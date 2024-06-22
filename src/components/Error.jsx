import { useContext } from 'react';
import { AppContext } from '../authentication/AppContext'
import { useNavigate } from "react-router-dom";

const Error = () => {
    const { loggedInUser, profile } = useContext(AppContext);
    const [currentUser, setCurrentUser] = loggedInUser;
    const [ profileUser, setProfileUser ] = profile;
    document.title = 'Oops';
    const nav = useNavigate();

    const showProfile = () => {
          setProfileUser(currentUser)
          nav(`/profile/${currentUser._id}`)
      }

  return (
    <>
        <div className="bg-404error bg-cover bg-bottom min-h-screen pb-20">
            <div className="flex justify-center items-center w-full h-screen">
                <div className='block'>
                    <h1 className="text-[18rem] text-blue-100 text-center">404<br /></h1>
                    <h1 className="text-5xl text-blue-100 text-center">Something weird has happened</h1>
                    <div className='flex justify-center pt-12'>
                        <button className="bg-dark-blue text-white text-lg md:text-xl lg:text-lg p-4 rounded-lg shadow-md m-1 w-56 hover:bg-white hover:text-dark-blue"
                            onClick={() => nav('/home')}>
                            Back to home
                        </button>
                    </div>
                    <div className='flex justify-center pt-3'>
                        <button className="bg-dark-blue text-white text-lg md:text-xl lg:text-lg p-4 rounded-lg shadow-md m-1 w-56 hover:bg-white hover:text-dark-blue"
                            onClick={() => showProfile()}>
                            View profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Error;