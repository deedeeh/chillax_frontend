
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
