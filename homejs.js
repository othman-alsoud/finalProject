 // const baseUrl="https://tarmeezacademy.com/api/v1"
 let currentPage =1
 let lastPage=1
// scroll

window.addEventListener("scroll", function(){
 const endOfPage = window.innerHeight + window.pageYOffset+1 >= document.body.scrollHeight;

   if(endOfPage && currentPage < lastPage){
    currentPage++
    getPosts(false,currentPage)
 } 
 //console.log(endOfPage, window.innerHeight , window.pageYOffset+1 , document.body.scrollHeight)
})
   

function userClicked(iduser){
 window.location=`profile.html?iduser=${iduser}`
}

  
function getPosts(relod=true,page=1){
    toggleLoader(true)
    if(relod){
       document.getElementById("posts").innerHTML=""
    }
  
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${page}`)
    .then((response)=>{
        toggleLoader(false)
      lastPage =response.data.meta.last_page
      
        const posts=response.data.data
       for (let post of posts) {
             
         
        let user=getCurrentUser()
        let ismypost=user != null && user.id == post.author.id
        let editbtncontent=``
        if(ismypost){
            editbtncontent=`
                <button type="button" class="btn btn-danger" style="float:right" onclick="deleatPostBtnCLick('${encodeURIComponent(JSON.stringify(post))}')">deleat</button>
                <button type="button" class="btn btn-primary mx-1" style="float:right" onclick="editPostBtnCLick('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
            `
        }
        
        if(post.title==null){
            post.title=""
        }
            document.getElementById("posts").innerHTML+=
            `
            <div class="card shadow">
                            <div class="card-header">
                            <span onclick="userClicked(${post.author.id})" style="cursor: pointer;">
                            <img src="${post.author.profile_image}" class="rounded-circle border border-2" alt="" style="height: 40px;width: 40px;">
                            <b>${post.author.username}</b>
                            </span>
 
                                    ${editbtncontent}
                           
                            </div>
                            <div class="card-body" onclick="postClick(${post.id})" style="cursor: pointer;">
                                <img class="w-100" src="${post.image}" alt="">
                                <h6 style="color:#b1b0b2" class="mt-1">${post.created_at}</h6>
                                <h4>
                                    ${post.title}
                                </h4>
                                <p>
                                    ${post.body}
                                </p>
                                <hr>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                    </svg>
                                    <span>
                                        ( ${post.comments_count}) Comments
                                    </span>
                                    <span id="tag-${post.id}">
                                       
                                    </span>
                                </div>
                                
                            </div>

                            
          </div>

            `
            document.getElementById(`tag-${post.id}`).innerHTML=""
            for (let tags of post.tags) {
                if(tags==null){
                    break
                }else{
                    document.getElementById(`tag-${post.id}`).innerHTML+=`<button type="button" class="btn btn-secondary mx-2">${tags.name}</button>`
                }
                
            }
        }
        
    })
    .catch((eroor)=>{
        alert(eroor)
    })
  }
  
    
  
  
function postClick(postid){

window.location=`postditel.html?postid=${postid}`

}



function editPostBtnCLick(postobj){//psot-modal-titile title-post
let post = JSON.parse(decodeURIComponent(postobj))


document.getElementById("id-edit-post-input").value=post.id

document.getElementById("psot-modal-titile").innerHTML="Edit Post"
document.getElementById("post-modal-submit-btn").innerHTML="Edit"
document.getElementById("title-post").value=post.title
document.getElementById("body-post").value=post.body
let postmodal=new bootstrap.Modal(document.getElementById("creat-post-model"),{})
postmodal.toggle()


}

function addbtnClick(){
    document.getElementById("id-edit-post-input").value=""
    document.getElementById("title-post").value=""
document.getElementById("body-post").value=""
    document.getElementById("psot-modal-titile").innerHTML="Creat a New Post"
document.getElementById("post-modal-submit-btn").innerHTML="Creat"
let postmodal=new bootstrap.Modal(document.getElementById("creat-post-model"),{})
postmodal.toggle()
}

function deleatPostBtnCLick(postobj){
    let post = JSON.parse(decodeURIComponent(postobj))

    document.getElementById("deleat-post-id-input").value=post.id

    let postmodal=new bootstrap.Modal(document.getElementById("deleat-post-model"),{})
    postmodal.toggle()
    

}
 function confirmPostDeleat(){
    const idpostdeleat=document.getElementById("deleat-post-id-input").value
    let url=`${baseUrl}/posts/${idpostdeleat}`
    const token=localStorage.getItem("token")
    let headerprams={
     
        "Authorization":`Bearer ${token}`,
}
toggleLoader(true)
   axios.delete(url,{
    headers : headerprams})
   .then((response) => {
     
      const model=document.getElementById("deleat-post-model")
      const modelInstance=bootstrap.Modal.getInstance(model)
      modelInstance.hide()
      
      showAleart('Delete Post sucsseccfly','success')
      getPosts()

   })
   .catch((eroor)=>{
    const masseg=eroor.response.data.message
        showAleart(masseg,'danger')
   })
   .finally(()=>{
    toggleLoader(false)
   })
 }
 

 

 //setUpUi()
 