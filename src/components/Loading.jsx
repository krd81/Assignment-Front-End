import React from 'react'

const Loading = () => {
  return (
    <>
    <div className="bg-blue-50 items-center justify-center mx-6 my-6 md:my-12 p-6 md:p-10 lg:mx-20 px-5 ">
        <div className='animate-pulse flex items-center justify-center h-screen '>
        {/* <svg className="animate-spin h-5 w-5 mr-3" viewBox='0 0 24 24'> */}
            <h1 className='text-5xl lg:text-[25vh] font-semibold text-gray-500 '>
                Loading...
            </h1>
            {/* </svg> */}
        </div>

    </div>
    </>

  )
}

export default Loading