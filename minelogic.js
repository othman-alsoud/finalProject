const baseUrl="https://tarmeezacademy.com/api/v1"
//import("./homejs")


function setUpUi(){

    const token=localStorage.getItem("token")
    if(token == null){   //user is gest  
        document.getElementById("logout-div").style.setProperty("display","none","important") //في طريقة اسهل انتا عرفها
        document.getElementById("login-div").style.setProperty("display","flex","important")
       
        document.getElementById("add-btn").style.setProperty("display","none","important")
        
    }else{
        document.getElementById("login-div").style.setProperty("display","none","important")
       document.getElementById("logout-div").style.setProperty("display","flex","important")
       document.getElementById("add-btn").style.setProperty("display","block","important")
        
      const user = getCurrentUser()
      document.getElementById("person-data").innerHTML=
                    `
                                <img src="${user.profile_image}" class="rounded-circle border border-2" alt="" style="height: 40px;width: 40px;">
                                <b>${user.username}</b>
                    `
    
      
    }
    }

    function getCurrentUser(){
         
        let user=null

        let userstorg=localStorage.getItem("user")

        if(user=!null){
          user=JSON.parse(userstorg)
           
        }

        return user
       
        
}

function loginBtnClicked(){
    const User =document.getElementById("Username").value
    const pass =document.getElementById("Password").value
    let prams={
           "username" : User,
           "password" : pass
        }
   let url=`${baseUrl}/login`
   toggleLoader(true)
   axios.post(url, prams)
   .then((response) => {
    toggleLoader(false)
      localStorage.setItem("token",response.data.token)
      localStorage.setItem("user",JSON.stringify( response.data.user))  //JSON.parse()  string=>object
       
      const model=document.getElementById("login-model")
      const modelInstance=bootstrap.Modal.getInstance(model)
      modelInstance.hide()
      showAleart('logeed User sucsseccfly','success')
      setUpUi()
      //getPost()
      getPosts()

   })
   .catch((eroor)=>{
    toggleLoader(false)
    const masseg=eroor.response.data.message
    showAleart(masseg,'danger')
         
    const model=document.getElementById("login-model")
      const modelInstance=bootstrap.Modal.getInstance(model)
      modelInstance.hide()
})

 }

 function registerBtnClicked(){
   const User_reg =document.getElementById("Username-reg").value
    const pass_reg =document.getElementById("Password-reg").value
    const name_reg =document.getElementById("name-reg").value
    const imageProfile=document.getElementById("image-profile").files[0] 
    let formData = new FormData()
   formData.append("username",User_reg)
   formData.append("password",pass_reg)
   formData.append("name",name_reg)
   formData.append("image",imageProfile)
    //  let prams={
   //         "username" : User_reg,
   //         "password" : pass_reg,
   //         "name" : name_reg
   //      }
   let url=`${baseUrl}/register`
   toggleLoader(true)
   axios.post(url,formData)
   .then((response)=>{//register-model
    
       localStorage.setItem("token",response.data.token)
      localStorage.setItem("user",JSON.stringify( response.data.user))  //JSON.parse()  string=>object
       
       const model=document.getElementById("register-model")
      const modelInstance=bootstrap.Modal.getInstance(model)
      modelInstance.hide()
      showAleart(' New User registered sucsseccfly','success')//
      setUpUi()
    // getPost()
      getPosts()

   })
   .catch((eroor)=>{
   
       const masseg=eroor.response.data.message
       showAleart(masseg,'danger')
            
       const model=document.getElementById("register-model")
      const modelInstance=bootstrap.Modal.getInstance(model)
      modelInstance.hide()
   })
   .finally(()=>{
    toggleLoader(false)
   })
 }

 
 function logout(){
   localStorage.removeItem("token")
   localStorage.removeItem("user")
   showAleart('logout User sucsseccfly','success')
   setUpUi()
  // getPost()
   getPosts()
 }

 function showAleart(message,type){
    const alertPlaceholder = document.getElementById('success-alert')

    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

   
        alert(message,type )
       //aleart hide :todo
        setTimeout(() => {
         //const alerthide = bootstrap.Alert.getOrCreateInstance('#success-alert')
        // alerthide.close()
    //     const model=document.getElementById("#success-alert")
    //    const modelInstance=bootstrap.Modal.getInstance(model)
    //    modelInstance.hide()
        },2000);
        
     
  }


  

  function CreatPostBtnClicked(){

    let postId=document.getElementById("id-edit-post-input").value
    let iscreat=( postId==null || postId=="")
    //console.log(iscreat,postId)

    const title=document.getElementById("title-post").value
    const body=document.getElementById("body-post").value
    const image=document.getElementById("image-post").files[0] 
    let formdata = new FormData()
    formdata.append("body",body)
    formdata.append("title",title)
    if(image!=null){
      formdata.append("image",image)
    }
  
   
    let url=``
    const token=localStorage.getItem("token")
    let headerprams={
     
            "Authorization":`Bearer ${token}`,
    }
    if(iscreat){
      url=`${baseUrl}/posts`
      toggleLoader(true)
    axios.post(url,formdata,{
      headers : headerprams
    })
    .then((response)=>{
        const model=document.getElementById("creat-post-model")
       const modelInstance=bootstrap.Modal.getInstance(model)
       modelInstance.hide()
       showAleart(' Creat new Post sucsseccfly','success')
       getPosts()
    })
    .catch((eroor)=>{
        const masseg=eroor.response.data.message
        showAleart(masseg,'danger')
             
        const model=document.getElementById("creat-post-model")
       const modelInstance=bootstrap.Modal.getInstance(model)
       modelInstance.hide()
    })
    .finally(()=>{
      toggleLoader(false)
    })

    }else{
      url=`${baseUrl}/posts/${postId}`
      formdata.append("_method","put")
      toggleLoader(true)
    axios.post(url,formdata,{
      headers : headerprams
    })
    .then((response)=>{
        const model=document.getElementById("creat-post-model")
       const modelInstance=bootstrap.Modal.getInstance(model)
       modelInstance.hide()
       showAleart(' Edit Post sucsseccfly','success')
       getPosts()
    })
    .catch((eroor)=>{
        const masseg=eroor.response.data.message
        showAleart(masseg,'danger')
             
        const model=document.getElementById("creat-post-model")
       const modelInstance=bootstrap.Modal.getInstance(model)
       modelInstance.hide()
    })
    .finally(()=>{
      toggleLoader(false)
    })

    }

  }

  // profile page
  function profileCLicked(){
    let user=getCurrentUser()
    window.location=`profile.html?iduser=${user.id}`
  }





  function toggleLoader(show){
    
    if(show){
        document.getElementById("loader").style.visibility ='visible'
    }
    else{
        document.getElementById("loader").style.visibility ='hidden'
    }
  
 }
  
