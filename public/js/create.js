const rgbColor = () =>{
    const userAvatar = document.querySelector('.user-avatar');
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    const color = `rgb(${r},${g},${b})`;
    userAvatar.style.backgroundColor = `${color}`;
    // console.log(color);
}

rgbColor();


const des = document.querySelector('.desc')
const aes = document.querySelector('.asen')
  
const input = document.querySelectorAll('input')[1];
  
des.addEventListener('click', function(){
    if(input.value > 1){
        input.value = input.value - 1;
    }else{
  
}})
let total = input.value
aes.addEventListener('click', function(){
    input.value = parseInt(total) + 1 
    total = input.value
})




