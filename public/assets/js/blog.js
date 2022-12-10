const { default: swal } = require("sweetalert");

const pathName=window.location.pathname;
console.log(pathName)

const upvoteBtn=document.querySelector('#upvote-btn');
const upvoteIcon=document.querySelector('#upvote-icon');
const upvoteLength=document.querySelector('#upvote-length');
const downvoteBtn=document.querySelector('#downvote-btn');
const downvoteIcon=document.querySelector('#downvote-icon');
const downvoteLength=document.querySelector('#downvote-length');

upvoteBtn.addEventListener("click", (function (){
    fetch(pathName+"/upvote",{method:'post'}).then((res)=>res.json())
    .then(data=>{
        if(data.success){
            swal("Vote", "Voted successfully", "success");
            upvoteIcon.style.color='blue'
            upvoteLength.innerHTML=data.total
            if(!data.downvoted){
                downvoteIcon.style.color='black';
                downvoteLength.innerHTML=data.downvoteTotal
            }
        }
        else{
            upvoteIcon.style.color='black'
            upvoteLength.innerHTML=data.total
        }
    })
}))

downvoteBtn.addEventListener("click", (function (){
    fetch(pathName+"/downvote",{method:'post'}).then((res)=>res.json())
    .then(data=>{
        if(data.success){
            swal("Vote", "Voted successfully", "success");
            downvoteIcon.style.color='red'
            downvoteLength.innerHTML=data.total
            if(!data.upvoted) {
                upvoteIcon.style.color='black';
                upvoteLength.innerHTML=data.upvoteTotal
            }
        }
        else{
            downvoteIcon.style.color='black'
            downvoteLength.innerHTML=data.total
        }
    })
}))


function deletePostBlog(id){
    fetch(`/blogdelete/${id}`,{method:'DELETE'})
    .then(res=>res.json())
    .then(data=>{
        if(data.success){
            alert("Successfully deleted")
            const desiredTimeInMilliSeconds = 100;

          setTimeout(function () {
            window.location = 'http://localhost:3000/';
          }, desiredTimeInMilliSeconds)
        }
    })
}
