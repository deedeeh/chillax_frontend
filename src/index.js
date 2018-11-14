const signupForm = document.querySelector('#signup-form')
const monthOrPriceFilter = document.querySelector(`#filter-form [name='month']`)
const resultList = document.querySelector('#result-list')
// more info element to go into each element appended to the page

usersURL = "http://localhost:3000/api/v1/users"
wishlistURL = "http://localhost:3000/api/v1/user_destinations"
destinationsURL = "http://localhost:3000/api/v1/destinations"
commentsURL = "http://localhost:3000/api/v1/comments"


const state = {
    currentUser: undefined,
    destinations: [],
}

//--------------------------------------------------------------------------------------------------------


const renderDestination = destination => {
    destinationEl = document.createElement('div')
    destinationEl.setAttribute('class','destination-element')
    destinationEl.setAttribute('data-id', destination.id)
    destinationEl.innerHTML=`
      <h2>${destination.title}</h2>
      <img src="${destination.pictures[0].picture_url}">
      <p>Recommended months: ${destination.months[0].name}</p>
      <p>Recommended budget: £${destination.price}</p>
      <div class='more-info'></div>
      <hr>
    `
    
     destinationEl.addEventListener('click', () => {
        const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
        
        moreInfoEl.innerHTML = 
        `<p>${destination.content}</p>`

        // ${destination.pictures.forEach(pic => `<img src="${pic.picture_url}">`)}  ASK SOMEONE ABOUT THIS

        destination.pictures.forEach(pic => {
            moreInfoEl.innerHTML += `<img src="${pic.picture_url}">`
        })
        
     })

    resultList.appendChild(destinationEl)
    state.renderedDestinations.push(destination)
}



//external event listeners

monthOrPriceFilter.addEventListener('keyup', () => {
    resultList.innerHTML=""
    let filteredDestinations = state.destinations.filter(destination => {
        return destination.months[0].name.toLowerCase().includes(monthOrPriceFilter.value.toLowerCase()) || parseInt(destination.price) <= parseInt(monthOrPriceFilter.value)
    })
    renderDestinations(filteredDestinations)
})

// replace title with month name (remove the month model? we have a string now instead of one_to_many relationship)
// add months worth flying to description in innerHTML of show of each page






//Render Destinations (run upon page load)
const renderDestinations = destinations => 
    destinations.forEach(destination => {renderDestination(destination)})

getDestinations()
    .then(destinations => {
        state.destinations = [...destinations]
        state.renderedDestinations = [...destinations]
        renderDestinations(destinations)})