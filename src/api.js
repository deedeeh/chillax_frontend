usersURL = "http://localhost:3000/api/v1/users"
wishlistURL = "http://localhost:3000/api/v1/user_destinations"
destinationsURL = "http://localhost:3000/api/v1/destinations"
commentsURL = "http://localhost:3000/api/v1/comments"


// --------------------------------------------

const addUser = (name, email) => {
    return fetch(usersURL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: name, email: email})
    }).then(resp=>resp.json())
}

const getAllUsers = () => 
    fetch(usersURL)
    .then(resp => resp.json())
    .then(result => state.allUsers = [...result])

const getUser = id => 
    fetch(`${usersURL}/${id}`)
    .then(resp => resp.json())

// --------------------------------------------- 

const getDestination = id =>
    fetch(`${destinationsURL}/${id}`)
    .then(resp => resp.json())

const getDestinations = () =>
    fetch(destinationsURL)
    .then(resp => resp.json())


// --------------------------------------------- 


const getComment = id =>
    fetch(`${commentsURL}/${id}`)
    .then(resp => resp.json())

const getComments = () =>
    fetch(commentsURL)
    .then(resp => resp.json())

const createComment = commentObject => 
    fetch(commentsURL,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(commentObject)
    }).then(resp => resp.json())

const deleteComment = id => 
    fetch(`${commentsURL}/${id}`,{
        method: "DELETE"
    }).then(resp=>resp.json())
// --------------------------------------------- 

const getUserDestination =  id =>
    fetch(`${wishlistURL}/${id}`)
    .then(resp => resp.json())

const getUserDestinations = () =>
    fetch(wishlistURL)
    .then(resp => resp.json())


const postUserDestination = (foundUser_id, foundDestination_id) =>
    fetch(wishlistURL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_id: foundUser_id, destination_id: foundDestination_id})
})