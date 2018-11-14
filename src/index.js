const signupForm = document.querySelector('#signup-form')
const filterForm = document.querySelector('#filter-form')
const resultList = document.querySelector('#result-list')
// more info element to go into each element appended to the page

usersURL = "http://localhost:3000/api/v1/users"
wishlistURL = "http://localhost:3000/api/v1/user_destinations"
destinationsURL = "http://localhost:3000/api/v1/destinations"
commentsURL = "http://localhost:3000/api/v1/comments"


const state = {
    currentUser: undefined,
    destinations: [],
    selectedDestination: undefined
}

//--------------------------------------------------------------------------------------------------------


const renderDestination = destination => {
    destinationEl = document.createElement('div')
    destinationEl.setAttribute('class','destination-element')
    destinationEl.setAttribute('data-id', destination.id)
    destinationEl.innerHTML=`
      <h2>${destination.title}</h2>
      <img class='main-image' id='myImg' data-img-id='${destination.pictures[0].id}' src="${destination.pictures[0].picture_url}">
      <p>Recommended budget: £${destination.price}</p>
      <div class='more-info'></div>
      <hr>
    `

    // imageEl = destinationEl.querySelector('img')
    //  imageEl.addEventListener('click', () => {
    //     const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
    //     const mainImage = document.querySelector(`img[data-img-id='${destination.pictures[0].id}']`)
    //     moreInfoEl.innerHTML = 
    //     `<div id="myModal" class="modal">
    //         <span class="close">&times;</span>
    //         <img class="modal-content" id="img01">
    //     </div>
    //     <p>${destination.content}</p>`

    //     // Get the image and insert it inside the modal - use its "alt" text as a caption
    //         const modal = document.querySelector('#myModal');
    //         // const img = document.querySelector('#myImg');
    //         const modalImg = document.querySelector("#img01");
    //         modal.style.display = "block";
    //         modalImg.setAttribute('src', `${mainImage.src}`);
            

    //     // ${destination.pictures.forEach(pic => `<img src="${pic.picture_url}">`)}  ASK SOMEONE ABOUT THIS

    //     destination.pictures.forEach(pic => {
    //         moreInfoEl.innerHTML += `<img src="${pic.picture_url}">`
    //     })

    //     const span = document.querySelector(".close");
    //     span.addEventListener('click', () =>  {
    //         modal.style.display = "none";
    //         console.log('closed')
    //     })
        
    //  })


    resultList.appendChild(destinationEl)

}

//create a separate modal method and call it in global event listener
const addModal = destination => {
    const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
    moreInfoEl.innerHTML = 
    `<div id="myModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="img01">
    </div>
    <p>${destination.content}</p>`

    
}

const addMainImageToModal = destination => {
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    const mainImage = document.querySelector(`img[data-img-id='${destination.pictures[0].id}']`)
    const modal = document.querySelector('#myModal');
    const modalImg = document.querySelector("#img01");
    modal.style.display = "block";
    modalImg.setAttribute('src', `${mainImage.src}`);
}

// const closeModal = () => {
//     const span = document.querySelector(".close");
//     span.addEventListener('click', () =>  {
//         modal.style.display = "none";
//     })
// }


const renderDestinations = destinations => 
    destinations.forEach(destination => {renderDestination(destination)})



getDestinations()
    .then(destinations => {
        state.destinations = [...destinations]
        renderDestinations(destinations)})

const findDestination = id => 
    state.destinations.find(destination => destination.id === parseInt(id))

const findDestinationByPic = (destinationId, imageId) => {
    state.selectedDestination = findDestination(destinationId)
    state.selectedDestination.pictures.find(pic => pic.id === imageId)
    return state.selectedDestination
}

const letsFindDestinationByPic = (imageId) => {
    state.selectedDestination = state.destinations.filter(dest => dest.pictures.find(pic=> pic.id == parseInt(imageId)))
    return state.selectedDestination
}
    // state.selectedDestination = findDestination(destinationId)
    // state.selectedDestination.pictures.find(pic => pic.id === imageId)
    // return state.selectedDestination


document.addEventListener('click', event => {
    if(event.target.className === 'main-image') {
        const id = event.target.dataset.imgId
        letsFindDestinationByPic(id)
        addModal(state.selectedDestination[0])
        addMainImageToModal(state.selectedDestination[0])
    }

    if(event.target.className === 'close') {
        const modal = document.querySelector('#myModal')
        modal.style.display = "none";
    }

    


})