let storeCaptcha = 0 ;
const captcha = () =>{
    const w = Math.floor(Math.random() * 10);
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    const z = Math.floor(Math.random() * 10);
    storeCaptcha = `${w}${x}${y}${z}`
}

const Redo = document.querySelector('.fas.fa-redo-alt');
const inputCaptcha = document.querySelector('.captchaHolder')
const validCaptcha = document.querySelector('.validCaptcha')
const captchaButton = document.querySelector('.captchaSubmit')



Redo.addEventListener('click', function(){
    captcha();
    inputCaptcha.value = storeCaptcha
    validCaptcha.value = ''
    captchaButton.setAttribute('disabled','');
})

validCaptcha.addEventListener('change', function(){
    if(inputCaptcha.value === validCaptcha.value){
        captchaButton.removeAttribute('disabled');
        console.log(inputCaptcha.value, validCaptcha.value)

    }else{
        captchaButton.setAttribute('disabled','');    
    }    

})



