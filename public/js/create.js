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


