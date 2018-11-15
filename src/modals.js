
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


//DINA create a separate modal method and call it in global event listener
const addModal = destination => {
    const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
   
    moreInfoEl.innerHTML = 
    `<div id="myModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="img01">
        <div class="all-pictures"></div>
        <p class="caption">${destination.content}</p>
        <p class="caption">Recommended budget: £${destination.price} per couple</p>
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
   
    destination.comments.forEach(comment => {
        let commentUser = findUserById(comment.user_id)
        
        commentList.innerHTML += `<li data-user-id=${commentUser.id} class="caption"> ${commentUser.name}: ${comment.content}</li>`
        const commentItem = document.querySelector(`li[data-user-id="${commentUser.id}"]`)
        commentUser.id === state.currentUserObject.id ? commentItem.innerHTML += `<br><button value="">Delete me</button>` : ""
        })
    
    
    const commentForm = document.querySelector(`.comment-form`)

    commentForm.addEventListener('submit', event => {
        event.preventDefault()
        const commentTextField = document.querySelector(`input[name="comment-text"]`)
        let comment = commentTextField.value
        commentCreationFunction(destination)
        commentList.innerHTML += `<p class="caption" data-id="${comment.id}">${state.currentUser}: ${comment} </p><br>`
    })
} 