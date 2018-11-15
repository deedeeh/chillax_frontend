
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
        console.log('deleted from page')
        deleteComment(deleteBtnId)
        console.log('deleted from db')
        deleteCommentFromLocal(deleteBtnId)
        console.log('deleted from locals')
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

    
    const commentList = document.querySelector(`.comment-list`)
    const commentForm = document.querySelector(`.comment-form`)

    destination.comments.forEach(comment => {
        let commentUser = findUserById(comment.user_id)
        addCommentToPage(comment, commentList, commentUser)
        const commentItem = document.querySelector(`li[data-comment-id="${comment.id}"]`)
        if(comment.user_id === state.currentUserObject.id) {
            appendDeleteButton(commentItem, comment.id)
        } 
    })
        
   
    commentForm.addEventListener('submit', event => {
        event.preventDefault()
        commentCreationFunction(destination)
             .then(resp => {
                 addCommentToPage(state.returnedComment, commentList, state.currentUserObject)
                state.selectedDestination.comments.push(state.returnedComment)
             }).then(resp => {
                 let lastComment = document.querySelector('.comment-list').lastElementChild
                 appendDeleteButton(lastComment, state.returnedComment.id)
                })
                
           
    })
} 


const addCommentToPage = (commentObject, commentList, userObject) => {
    console.log(commentObject)
    let commentEl = document.createElement('div')
    let commentUser = userObject
    if (userObject === undefined){ commentUser = state.currentUserObject}
    console.log("found the guy" , commentUser)
    commentEl.innerHTML = `<li data-user-id=${commentUser.id} data-comment-id="${commentObject.id}" class="caption"> ${commentUser.name}: ${commentObject.content}</li>`
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


const appendDeleteButton = (commentItem, comment_id) => {
            //commentItem is where we shove the button
            const commentDeleteButton = document.createElement('button')
            commentDeleteButton.setAttribute('data-comment-id',comment_id)
            commentDeleteButton.classList.add('delete-btn')
            commentDeleteButton.innerText = "Delete me"
            commentItem.appendChild(commentDeleteButton)
}

const deleteCommentFromLocal = id => {
    state.destinations = state.destinations.filter(destination => destination.comments.filter(comment => comment.id != id))
    state.selectedDestination.comments = state.selectedDestination.comments.filter(comment => comment.id != id)
}