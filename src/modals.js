
// DINA append Image to Modal
const addMainImageToModal = destination => {
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    const mainImage = document.querySelector(`img[data-img-id='${destination.pictures[0].id}']`)
    const modal = document.querySelector('#myModal');
    // const modalImg = document.querySelector("#img01");
    const modalImg = document.querySelector("#expandedImg");
    modal.style.display = "block";
    // modalImg.classList.add('expandedImg')
    modalImg.setAttribute('src', `${mainImage.src}`);

    // const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
    // const picturesDivEl = moreInfoEl.querySelector('.all-pictures')

    const thumbnailsRow = modal.querySelector('.thumbnails-row')

    destination.pictures.forEach(pic => {
        thumbnailsRow.innerHTML += `<div class="column"><img data-img-id="${pic.id}" class="modal-content override-modal-layout" src="${pic.picture_url}"}/></div>`
    })

}

const expandingImg = (destination, id) => {
    const expandImg = document.querySelector("#expandedImg");
    const foundPic = destination.pictures.find(pic => pic.id === parseInt(id))
    expandImg.src = foundPic.picture_url;
    expandImg.parentElement.style.display = "block";
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
        deleteButtonFunctionality()
    }
    

    if(event.target.classList.contains('override-modal-layout')) {
        const id = event.target.dataset.imgId
        const currentDestination = letsFindDestinationByPic(id)
        expandingImg(currentDestination, id)
    }
 

})



// "this.parentElement.style.display='none'"


//DINA create a separate modal method and call it in global event listener
const addModal = destination => {
    const moreInfoEl = document.querySelector(`div [data-id='${destination.id}'] .more-info`)
    moreInfoEl.innerHTML = 
    `<div id="myModal" class="modal">
        <span class="close">&times;</span>
        <div class="all-pictures">
            <div class="container">
                <img class="modal-content" id="expandedImg"/>
            </div>
            <div class="thumbnails-row">

            </div>
        </div>
        <p class="caption">${destination.content}</p>
        <p class="caption">Recommended budget: £${destination.price} per couple</p>
        <p class="caption">Recommended months: ${destination.months[0].name}</p>
        <div class="comment-list"></div>
        <form class="comment-form">
            <input name="comment-text" class="caption" placeholer="Add a comment">
            <input class="caption" type="submit" value="Add comment">
        </form>
    </div>`

    
    const commentList = document.querySelector(`.comment-list`)
    const commentForm = document.querySelector(`.comment-form`)

    destination.comments.forEach(comment => {
        let commentUser = findUserById(comment.user_id)
        addCommentToPage(comment, commentList, commentUser)
        const commentItem = document.querySelector(`div[div-comment-id="${comment.id}"]`)
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
             })
             .then(resp => {
                 let lastComment = document.querySelector('.comment-list').lastElementChild
                 appendDeleteButton(lastComment, state.returnedComment.id)
                }).then(getDestinations)
                .then(destinations => {
                    state.destinations = [...destinations]
                    renderDestinations(destinations)})
                
   
    })

} 


const addCommentToPage = (commentObject, commentList, userObject) => {
    console.log(commentObject)
    let commentEl = document.createElement('div')
    commentEl.setAttribute('div-comment-id',commentObject.id)
    let commentUser = userObject
    if (userObject === undefined){ commentUser = state.currentUserObject}
    console.log("found the guy" , commentUser)
    commentEl.innerHTML = `<li data-user-id=${commentUser.id} data-comment-id="${commentObject.id}" class="caption"> ${commentUser.name}:<br /> ${commentObject.content}</li>`
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
            // commentDeleteButton.style.
            commentDeleteButton.innerText = "Delete me"
            commentDeleteButton.addEventListener('click', ()=>{
                deleteButtonFunctionality
                commentDeleteButton.remove()
            })
            commentItem.appendChild(commentDeleteButton)
}

const deleteCommentFromLocal = id => {
    state.destinations = state.destinations.filter(destination => destination.comments.filter(comment => comment.id != id))
    state.selectedDestination.comments = state.selectedDestination.comments.filter(comment => comment.id != id)
}


const deleteButtonFunctionality = () =>{
    console.log('creating delete button')
    const deleteBtnId = event.target.dataset.commentId
    const commentItem = document.querySelector(`li[data-comment-id="${deleteBtnId}"]`)
    commentItem.remove()
    console.log('deleted from page')
    deleteComment(deleteBtnId)
    console.log('deleted from db')
    deleteCommentFromLocal(deleteBtnId)
    console.log('deleted from locals')
}


