const signupForm = document.querySelector('#signup-form')
const signupName = document.querySelector(`#signup-form [name='name']`)
const signupEmail = document.querySelector(`#signup-form [name='email']`)
const monthOrPriceFilter = document.querySelector(`#filter-form [name='month']`)
const resultList = document.querySelector('#result-list')
const favouritesList = document.querySelector('.favourites-list')
const showHide = document.querySelector("#show-hide-content")

const state = {
    currentUser: undefined,
    destinations: [],
    selectedDestination: undefined,
    currentUserEmail: undefined,
    allUserDestinations: [],
    currentUserFavourites: [],
    allUsers: []
}

//-------------------------------functions-------------------------------------------------------------------------//


const renderDestination = destination => {
    destinationEl = document.createElement('div')
    destinationEl.setAttribute('class','destination-element')
    destinationEl.setAttribute('data-id', destination.id)
    destinationEl.innerHTML=`
      <h2>${destination.title}</h2>

      <img class='main-image' id='myImg' data-img-id='${destination.pictures[0].id}' src="${destination.pictures[0].picture_url}">

      <p>Recommended months: ${destination.months[0].name}</p>
      <p>Recommended budget: £${destination.price}</p>
      <button class='add-favourite'>Add to favourites</button>
      <div class='more-info'></div>
      <hr>
    `

    addFavouriteButton = destinationEl.querySelector('.add-favourite')
    addFavouriteButton.addEventListener('click', () =>  addDestinationToFavourites( state.currentUserEmail, destination.title) )
    resultList.appendChild(destinationEl)
}

//DINA create a separate modal method and call it in global event listener
const addModal = destination => {
    const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
   
    moreInfoEl.innerHTML = 
    `<div id="myModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="img01">
        <div class="all-pictures"></div>
        <p class="caption">${destination.content}</p>
        <p class="caption">${destination.price}</p>
        <p class="caption">Recommended months: ${destination.months[0].name}</p>
        <div class="comment-list"></div>
        <form class="comment-form">
            <input name="comment-text" class="caption" placeholer="Add a comment">
            <input  class="caption" type="submit" value="Add comment">
        </form>
    </div>`

    // const filteredComments = renderCommentsFromDb(destination)
    // filteredComments.forEach(comment =>
    // moreInfoEl.innerHTML += `${comment.content}` )

    const commentList = document.querySelector(`.comment-list`)
    destination.comments.forEach(comment => commentList.innerHTML += `<p class="caption"> ${findUserById(comment.user_id).name}: ${comment.content}</p><br>`)
    
    const commentForm = document.querySelector(`.comment-form`)

    commentForm.addEventListener('submit', event => {
        event.preventDefault()
        const commentTextField = document.querySelector(`input[name="comment-text"]`)
        let comment = commentTextField.value
        commentCreationFunction(destination)
        commentList.innerHTML += `<p class="caption">${state.currentUser}: ${comment}</p><br>`
    })
} 



const findUserById = id => state.allUsers.find(user => user.id === parseInt(id))

//------------------------------------


// const renderCommentsFromDb = (destination) => {
//     const commentList = document.querySelector(`.comment-list`)
//     commentList.innerHTML=""
//     getComments()
//         .then(comments => {
//             comments.forEach(comment => 
//                 comment.destination_id == destination.id ? commentList.innerHTML += comment : "")
//         })

// }


//-----works okay: ----//

const commentCreationFunction = destination => {
    const commentTextField = document.querySelector(`input[name="comment-text"]`)
    const commentList = document.querySelector(`.comment-list`)
    let foundUser = findUserByName(state.currentUser)
    //front end 
    let comment = commentTextField.value
    // let commentEl = document.createElement('p')
    // commentEl.classList.add('caption')
    // commentEl.innerText = `${foundUser.name}: ${comment}`
    // commentList.appendChild(commentEl)
    //backend
    let commentObject = {user_id: foundUser.id, destination_id: destination.id, content: comment}
    createComment(commentObject)

    commentTextField.value = ""
}






//--------------------------------------------





    
// ED find destination by image id
const letsFindDestinationByPic = (imageId) => {
    state.selectedDestination = state.destinations.find(dest => dest.pictures.find(pic=> pic.id == parseInt(imageId)))
    return state.selectedDestination
}
// DINA append Image to Modal
const addMainImageToModal = destination => {
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    const mainImage = document.querySelector(`img[data-img-id='${destination.pictures[0].id}']`)
    console.log(mainImage)
    const modal = document.querySelector('#myModal');
    const modalImg = document.querySelector("#img01");
    modal.style.display = "block";
    modalImg.setAttribute('src', `${mainImage.src}`);

    const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
    const picturesDivEl = moreInfoEl.querySelector('.all-pictures')

    destination.pictures.forEach(pic => {
        picturesDivEl.innerHTML += `<img class="modal-content" src="${pic.picture_url}">`
    })

}
//DINA find destination by id
const findDestination = id => 
    state.destinations.find(destination => destination.id === parseInt(id))


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
            .then(getAllUsers)
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


//DINA picture event listener
document.addEventListener('click', event => {
    // click on the main image
    if(event.target.className === 'main-image') {
        const id = event.target.dataset.imgId
        letsFindDestinationByPic(id)
        addModal(state.selectedDestination)
        addMainImageToModal(state.selectedDestination)
    }
    // ED click on the favorite list item 
    if(event.target.className === 'favourites-item'){
        const dataId = event.target.dataset.destinationId
        foundDestination = state.destinations.find(dest=>dest.id==dataId)
        addModal(foundDestination)
        state.selectedDestination = foundDestination
        addMainImageToModal(foundDestination)
    }
    // click on the X 
    if(event.target.className === 'close') {
        const moreInfoEl = document.querySelector(`div [data-id='${state.selectedDestination.id}'] .more-info`)
        const modal = document.querySelector('#myModal')
        modal.style.display = "none"
        moreInfoEl.innerHTML = ''
    }

    
})

//argument - currentUser to show all the user's favourites
const favouritesListRender = () => {
    //filters only current user's favs:
    state.currentUserFavourites = state.allUserDestinations.filter(fav => fav.user.email.toLowerCase() === state.currentUserEmail.toLowerCase())
    // shoves them into the inner HTML:
    favouritesList.innerHTML=""
    state.currentUserFavourites.forEach(fav => {
        favouritesList.innerHTML += `<li class="favourites-item" data-destination-id="${fav.destination.id}">${fav.destination.title}</li>`
        console.log(fav.destination.title)
    })    
}

const findUserByName = name => state.allUsers.find(user => user.name === name)


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






//----------Useless crap? ------------//


// const findDestinationByPic = (destinationId, imageId) => {
//     state.selectedDestination = findDestination(destinationId)
//     state.selectedDestination.pictures.find(pic => pic.id === imageId)
//     return state.selectedDestination
// }


//----------------------------------//
//after addModal, line 60:


    // else {
    //     picturesDivEl.innerHTML = ""
    // }

// const addImagesToModal = destination => {
//     const modal = document.querySelector('#myModal');

//     <div class="row">
//         <div class="column">
//             <img src="img_nature.jpg" style="width:100%">
//         </div>
//     </div>
// }


//---------in render destination -------//

        // // ${destination.pictures.forEach(pic => `<img src="${pic.picture_url}">`)}  ASK SOMEONE ABOUT THIS

        // destination.pictures.forEach(pic => {
        //     moreInfoEl.innerHTML += `<img src="${pic.picture_url}">`
        // })
        
