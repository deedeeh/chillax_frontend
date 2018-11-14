const signupForm = document.querySelector('#signup-form')
const signupName = document.querySelector(`#signup-form [name='name']`)
const signupEmail = document.querySelector(`#signup-form [name='email']`)
const monthOrPriceFilter = document.querySelector(`#filter-form [name='month']`)
const resultList = document.querySelector('#result-list')
// more info element to go into each element appended to the page

const state = {
    currentUser: undefined,
    destinations: [],
    selectedDestination: undefined,
    currentUserEmail: undefined

}

//--------------------------------------------------------------------------------------------------------


const renderDestination = destination => {
    destinationEl = document.createElement('div')
    destinationEl.setAttribute('class','destination-element')
    destinationEl.setAttribute('data-id', destination.id)
    destinationEl.innerHTML=`
      <h2>${destination.title}</h2>

      <img class='main-image' id='myImg' data-img-id='${destination.pictures[0].id}' src="${destination.pictures[0].picture_url}">
      <img src="${destination.pictures[0].picture_url}">
      <p>Recommended months: ${destination.months[0].name}</p>
      <p>Recommended budget: £${destination.price}</p>
      <div class='more-info'></div>
      <hr>
    `

    //     // ${destination.pictures.forEach(pic => `<img src="${pic.picture_url}">`)}  ASK SOMEONE ABOUT THIS

    //     destination.pictures.forEach(pic => {
    //         moreInfoEl.innerHTML += `<img src="${pic.picture_url}">`
    //     })
        

    resultList.appendChild(destinationEl)
}

//create a separate modal method and call it in global event listener
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
    </div>`
    
} 
    
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

//external event listeners


//filter Eventlistener:
monthOrPriceFilter.addEventListener('keyup', () => {
    resultList.innerHTML=""
    let filteredDestinations = state.destinations.filter(destination => {
        return destination.months[0].name.toLowerCase().includes(monthOrPriceFilter.value.toLowerCase()) || parseInt(destination.price) <= parseInt(monthOrPriceFilter.value)
    })
    renderDestinations(filteredDestinations)
})

//sign-up form event listener and current user/email assigner:
signupForm.addEventListener('submit', event => {
    event.preventDefault()
    state.currentUser = signupName.value
    state.currentUserEmail = signupEmail.value
    console.log(state.currentUser, state.currentUserEmail)
    signupForm.innerHTML = ''
    //checks if the user exists . Welcomes and if not, adds to DB
    loggedinUser = state.allUsers.find(user => user.email.toLowerCase() === state.currentUserEmail.toLowerCase())

    if (loggedinUser) {signupForm.innerText = `Welcome back, ${state.currentUser}`}
    else {
        signupForm.innerText = `Welcome, ${state.currentUser}`
        addUser(state.currentUser, state.currentUserEmail)
        }   
})

//Render Destinations (run upon page load)
const renderDestinations = destinations => 
    destinations.forEach(destination => {renderDestination(destination)})

getDestinations()
    .then(destinations => {
        state.destinations = [...destinations]

        renderDestinations(destinations)})

const findDestination = id => 
    state.destinations.find(destination => destination.id === parseInt(id))

// const findDestinationByPic = (destinationId, imageId) => {
//     state.selectedDestination = findDestination(destinationId)
//     state.selectedDestination.pictures.find(pic => pic.id === imageId)
//     return state.selectedDestination
// }

const letsFindDestinationByPic = (imageId) => {
    state.selectedDestination = state.destinations.filter(dest => dest.pictures.find(pic=> pic.id == parseInt(imageId)))
    return state.selectedDestination
}

document.addEventListener('click', event => {
    if(event.target.className === 'main-image') {
        const id = event.target.dataset.imgId
        letsFindDestinationByPic(id)
        addModal(state.selectedDestination[0])
        addMainImageToModal(state.selectedDestination[0])
    }

    if(event.target.className === 'close') {
        const moreInfoEl = document.querySelector(`div [data-id='${state.selectedDestination[0].id}'] .more-info`)
        const modal = document.querySelector('#myModal')
        modal.style.display = "none"
        moreInfoEl.innerHTML = ''
    }

})
//Retrieves all users from the db to later confirm
getAllUsers()
