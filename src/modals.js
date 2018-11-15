
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

    if(event.target.classList.value === 'delete-btn') {
        const deleteBtnId = event.target.dataset.commentId
        const commentItem = document.querySelector(`li[data-comment-id="${deleteBtnId}"]`)
        commentItem.remove()
        deleteComment(deleteBtnId).then(getComments)


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
    const commentForm = document.querySelector(`.comment-form`)

    // currentComments = getComments().filter(comment => destination.comment.id === comment.id)
    destination.comments.forEach(comment => {
        let commentUser = findUserById(comment.user_id)
        commentList.innerHTML += `<li data-user-id=${commentUser.id} data-comment-id="${comment.id}" class="caption"> ${commentUser.name}: ${comment.content}</li>`
        const commentItem = document.querySelector(`li[data-user-id="${commentUser.id}"]`)
        if(commentUser.id === state.currentUserObject.id) {
            AppendDeleteButton(commentItem, comment.id)
        } 
    })
        
   
    commentForm.addEventListener('submit', event => {
        event.preventDefault()
        const commentTextField = document.querySelector(`input[name="comment-text"]`)
        let comment = commentTextField.value
        commentCreationFunction(destination)
             .then(resp=>createCommentAfterResponse(state.returnedComment, commentList))
    })
} 




const createCommentAfterResponse = (commentObject,commentList) => {
    console.log(commentObject)
    commentEl = document.createElement('div')
    commentEl.innerHTML = `<li data-user-id=${state.currentUserObject.id} data-comment-id="${commentObject.id}" class="caption"> ${state.currentUserObject.name}: ${commentObject.content}</li>`
    commentList.appendChild(commentEl)
}


const commentCreationFunction = destination => {
    const commentTextField = document.querySelector(`input[name="comment-text"]`)
    let comment = commentTextField.value
    let commentObject = {user_id: state.currentUserObject.id, destination_id: destination.id, content: comment}
    commentTextField.value = ""
    return createComment(commentObject)
            .then(resp => state.returnedComment = resp)
}


const AppendDeleteButton = (commentItem, comment_id) => {
    const commentDeleteButton = document.createElement('button')
            commentDeleteButton.setAttribute('data-comment-id',comment_id)
            commentDeleteButton.classList.add('delete-btn')
            commentDeleteButton.innerText = "Delete me"
            commentItem.appendChild(commentDeleteButton)
}
