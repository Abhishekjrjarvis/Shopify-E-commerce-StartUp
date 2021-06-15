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



const creditDebitCard = document.querySelector('.creditDebitCard')
const cvv = document.querySelector('.cvv')
const payCard = document.querySelector('.payCard');
const small = document.getElementsByTagName('small')[4]
const smallCard = document.getElementsByTagName('small')[5]

creditDebitCard.addEventListener('change', function(){
    if(creditDebitCard.value.length === 16 ){
        console.log('Nice Good To go....')
        small.style.display = 'block';
        smallCard.style.display = 'none';


    }
    else{
        console.log('Enter a vaild card details')
        smallCard.style.display = 'block';
        small.style.display = 'none';

    }
})


cvv.addEventListener('change', function(){
    if(cvv.value.length === 3){
        console.log('high secure cvv does not reveal')
    }
    else{
        console.log('Enter a valid cvv....')
    }
})



