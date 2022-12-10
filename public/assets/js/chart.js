const labels=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
var timeValue=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var month=['January','February','March','April','May','June','July','August','September','October','November','December']

const userId=window.location.href.split('http://localhost:3000/profile/')

if(userId.length===1){

fetch('/timeline',{
  method:'get'
})
.then(res=> res.json())
.then(data=>{
  console.log(data)
  data.timeLine.forEach(time=>{
    timeValue[time.day-1]=time.post
  })



let lineChart=document.getElementById('myChart').getContext('2d');

let massChart=new Chart(lineChart,{
  type:'line',
  data:{
    labels: labels,
    datasets: [{
      label: month[data.month-1],
      data: timeValue,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
})

})

}

else{

fetch(`/timeline/${userId[1]}`,{
  method:'get'
})
.then(res=> res.json())
.then(data=>{
  console.log(data)
  data.timeLine.forEach(time=>{
    timeValue[time.day-1]=time.post
  })



let lineChart=document.getElementById('myChart').getContext('2d');

let massChart=new Chart(lineChart,{
  type:'line',
  data:{
    labels: labels,
    datasets: [{
      label: month[data.month-1],
      data: timeValue,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
})



})

}

