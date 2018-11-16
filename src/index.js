const signupForm = document.querySelector('#signup-form')
const signupName = document.querySelector(`#signup-form [name='name']`)
const signupEmail = document.querySelector(`#signup-form [name='email']`)
const monthOrPriceFilter = document.querySelector(`#filter-form [name='month']`)
const resultList = document.querySelector('#result-list')
const favouritesList = document.querySelector('.favourites-list')
const showHide = document.querySelector("#show-hide-content")

const state = { 
    currentUserObject: undefined,
    currentUser: undefined,
    destinations: [],
    selectedDestination: undefined,
    currentUserEmail: undefined,
    allUserDestinations: [],
    currentUserFavourites: [],
    allUsers: [],
    returnedComment: undefined
}


//-------------------------------functions-------------------------------------------------------------------------//


const findUserById = id => state.allUsers.find(user => user.id === parseInt(id))
const findUserByName = name => state.allUsers.find(user => user.name === name)
const findUserByEmail = email => state.allUsers.find(user => user.email === email)
const findDestination = id => state.destinations.find(destination => destination.id === parseInt(id))
const letsFindDestinationByPic = (imageId) => {
state.selectedDestination = state.destinations.find(dest => dest.pictures.find(pic=> pic.id == parseInt(imageId)))
    return state.selectedDestination
}


const renderDestination = destination => {
    destinationEl = document.createElement('div')
    destinationEl.setAttribute('class','destination-element')
    destinationEl.setAttribute('data-id', destination.id)
    destinationEl.innerHTML=`
     
      <div class="style-result-images">
        <img class='main-image' id='myImg' data-img-id='${destination.pictures[0].id}' src="${destination.pictures[0].picture_url}">
      </div>
      <div class="destination-container-div">
      <h2>${destination.title}</h2>
        <p>Recommended months: ${destination.months[0].name}</p>
        <p>Recommended budget: £${destination.price} per couple</p>
        <button class='add-favourite'>Add to favourites</button>
        <div class='more-info'></div>
      </div>
      <hr>
    `
    addFavouriteButton = destinationEl.querySelector('.add-favourite')
    addFavouriteButton.addEventListener('click', () =>  addDestinationToFavourites( state.currentUserEmail, destination.title) )
    resultList.appendChild(destinationEl)


}




// const commentCreationFunction = destination => {
//     const commentTextField = document.querySelector(`input[name="comment-text"]`)
//     let foundUser = findUserByName(state.currentUser)
//     let comment = commentTextField.value
//     let commentObject = {user_id: foundUser.id, destination_id: destination.id, content: comment}
//     commentTextField.value = ""
//     let commentReturnObject
//     createComment(commentObject).then(resp => commentReturnObject = [...resp])
//     console.log('returned from db: ', commentReturnObject)
//     return commentReturnObject
// }


//--------------------------------------------------event listeners----------------------------------------------------------//


//ED filter Eventlistener:
monthOrPriceFilter.addEventListener('keyup', () => {
    resultList.innerHTML=""
    let filteredDestinations = state.destinations.filter(destination => {
        return destination.months[0].name.toLowerCase().includes(monthOrPriceFilter.value.toLowerCase()) || parseInt(destination.price) <= parseInt(monthOrPriceFilter.value)
    })
    renderDestinations(filteredDestinations)
})

//ED sign-up form event listener and current user/email assigner:

signupForm.addEventListener('submit', event => {
    event.preventDefault()
    state.currentUser = signupName.value
    state.currentUserEmail = signupEmail.value
    console.log(state.currentUser, state.currentUserEmail)
    state.currentUserObject = findUserByEmail(state.currentUserEmail)
    signupForm.innerHTML = ''
    //checks if the user exists . Welcomes and if not, adds to DB
    loggedinUser = state.allUsers.find(user => user.email.toLowerCase() === state.currentUserEmail.toLowerCase())
    if (loggedinUser){
        signupForm.innerText = `Welcome back, ${state.currentUser}`
        favouritesListRender()
    }
    else {
        signupForm.innerText = `Welcome, ${state.currentUser}`
        addUser(state.currentUser, state.currentUserEmail)
            .then(res=>getAllUsers())
            .then(res=>state.currentUserObject = findUserByEmail(state.currentUserEmail))
    }
    // allow viewing entire page
    showHide.style.display="block"
})


// Both - add destination to userDestinations
const addDestinationToFavourites = (userEmail, destinationName) => {
    foundDestination = state.destinations.find(dest=> dest.title === destinationName)
    console.log('found the destination:', foundDestination)

    foundUser = state.allUsers.find(user => user.email === userEmail)
    console.log('found the user. this is before the post request: ',foundUser)

    postUserDestination(foundUser.id, foundDestination.id)
        .then(getUserDestinations)
        .then(userDestinations => {
            state.allUserDestinations = [...userDestinations]
            favouritesListRender()})    
}


//argument - currentUser to show all the user's favourites
const favouritesListRender = () => {
    //filters only current user's favs:
    state.currentUserFavourites = state.allUserDestinations.filter(fav => fav.user.email.toLowerCase() === state.currentUserEmail.toLowerCase())
    // shoves them into the inner HTML:
    favouritesList.innerHTML=""
    state.currentUserFavourites.forEach(fav => {
        console.log(fav)
        favouritesList.innerHTML += `<li class="favourites-item" data-destination-id="${fav.destination.id}">${fav.destination.title}</li>`
        let locatedDestination = findDestination(fav.destination.id)
        favouritesList.innerHTML += `<div class="style-fav-images"><img class='fav-image' src='${locatedDestination.pictures[0].picture_url}'></div>`
      
    })    
}




//ED Render Destinations (run upon page load)
const renderDestinations = destinations => 
    destinations.forEach(destination => {renderDestination(destination)})

getDestinations()
    .then(destinations => {
        state.destinations = [...destinations]
        renderDestinations(destinations)})

//ED Retrieves all users from the db to later confirm
getAllUsers()
getUserDestinations().then(resp => state.allUserDestinations = [...resp])

// hides data on page except footer and login
showHide.style.display="none"




