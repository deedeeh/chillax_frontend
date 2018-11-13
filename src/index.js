const signupForm = document.querySelector('#signup-form')
const filterForm = document.querySelector('#filter-form')
const resultList = document.querySelector('#result-list')
// more info element to go into each element appended to the page

usersURL = "http://localhost:3000/api/v1/users"
wishlistURL = "http://localhost:3000/api/v1/user_destinations"
destinationsURL = "http://localhost:3000/api/v1/destinations"
commentsURL = "http://localhost:3000/api/v1/comments"



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

// --------------------------------------------- 

const getUserDestination =  id =>
    fetch(`${wishlistURL}/${id}`)
        .then(resp => resp.json())

const getUserDestinations = () =>
    fetch(wishlistURL)
        .then(resp => resp.json())

// --------------------------------------------- 