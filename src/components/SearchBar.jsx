import { useContext, useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../authentication/AppContext'
import Fuse from 'fuse.js'

// Recieve users props to SearchBar from UserSearch
const SearchBar = () => {
    const {allUsers, profile} = useContext(AppContext)
    const [users, setUsers] = allUsers
    const [profileUser, setProfileUser] = profile
    // Set query state to empty string
    const [query, setQuery] = useState('')
    // Set result state to empty list
    const [results, setResults] = useState([])
    const nav = useNavigate()



// Create Fuse object
useEffect(() => {
    const fuse = new Fuse(users, {
        // Item keys to be rendered later
        keys: [
            "department",
            "lastName",
            "firstName",
            "role",
            "aboutMe"
        ],
        includeScore: true,
    })

    // Perform search if query is already present
    if (query.length > 2) {
        const result = fuse.search(query)
        setResults(result)
    }
}, [users, query]) // Depend on users and query so Fuse updates as needed

const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
}

const showProfile = () => {
    console.log(profileUser)
    console.log(profileUser._id)
    // setProfileUser(currentUser)
    nav(`/profile/${profileUser._id}`)

}

  return (
    <div>
        <div className="flex justify-center items-center">
            <input
                type="text"
                value={query}
                onInput={handleSearch}
                placeholder="Search"
                className="p-textarea-left bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mb-10"
            />
        </div>
        <div>
            {results?.map((result, index) => (
                <div key={index} className="border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 bg-blue-500 opacity-50 mb-5">
                    {/* DATABASE PROFILE PICTURE GOES HERE */}
                    <img href=""></img>
                    {/* Linking profile */}
                    <a onClick={(e) => {
                        if (e.target.tagName.toLowerCase() === 'span' && e.target.id === 'name') {
                            let name = e.target.innerText
                            console.log(name)
                            for (let user of users) {
                                if (user.firstName.concat(' ', user.lastName) === name) {
                                    console.log("Kelly")
                                    setProfileUser(user)
                                    showProfile()
                                }
                            }
                        }
                    }}>
                    <span id="name" className="block text-center mb-3 text-2xl">{result.item.firstName + " " + result.item.lastName}</span>
                    <span className="block text-center mb-3 text-l">{result.item.role}, {result.item.department}</span>
                   </a>
                </div>
            ))}
        </div>
    </div>
)
}

export default SearchBar