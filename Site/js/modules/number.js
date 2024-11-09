export function number(){
//NUMBER
const phoneBlock = document.querySelector(".courses__phone");

phoneBlock.addEventListener("keyup",(event)=>{
    let target = event.target;

    if (target.value.length==12) {
        target.classList.add("valid");
        target.classList.remove("invalid");

        event.target.closest(".courses__body").classList.add("active");

    }else if(target.value.length>12){
        target.value = target.value.slice(0, 12);
    } else{target.classList.add("invalid");  
        target.classList.remove("valid");

        event.target.closest(".courses__body").classList.remove("active");
    }   
});}