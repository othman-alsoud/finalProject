
function getcuruntUserID(){
    const urlparams = new URLSearchParams(window.location.search);
    let iduser= urlparams.get('iduser')
  return iduser
}

  

    
    setUpUi()
    getUser()
    getPosts()
    function getUser(){
        const id=getcuruntUserID()
        axios.get(`${baseUrl}/users/${id}`)
        .then((response)=>{
           const user =response.data.data
         //console.log(user)
            document.getElementById("header-imge").src=user.profile_image
            document.getElementById("emile").innerHTML = user.email
            document.getElementById("name").innerHTML=user.name
            document.getElementById("username").innerHTML=user.username
            
            document.getElementById("count-post").innerHTML=user.posts_count
            document.getElementById("count-comment").innerHTML=user.comments_count

            document.getElementById("name-post").innerHTML=`${user.username}'s`
        })
    }
     


      
function getPosts(){
   
    document.getElementById("posts").innerHTML=""
    
    const id=getcuruntUserID()
    toggleLoader(true)
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response)=>{

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
                                <img src="${post.author.profile_image}" class="rounded-circle border border-2" alt="" style="height: 40px;width: 40px;">
                                <b>${post.author.username}</b>

                                
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
        const masseg=eroor.response.data.message
       showAleart(masseg,'danger')
    })
    .finally(()=>{
        toggleLoader(false)
       })
  }
  