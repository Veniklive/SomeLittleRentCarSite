import { cabinet } from "./modules/cabinet.js";
import * as flsFunctions from "./modules/functions.js";
import { rent } from "./modules/rent.js";
flsFunctions.isWebp();

/*
import Swiper, { Navigation, Pagination } from 'swiper';
const swiper = new Swiper();
*/


//MAIN
const menuBlock = document.querySelector(".menu");
const wrapper = document.querySelector(".wrapper");

menuBlock.onclick = function(event){
    event.stopPropagation();
    document.querySelector(".nav").classList.add("opened");
    document.querySelector(".menu").classList.add("opened");


    wrapper.addEventListener("click", function(){
        document.querySelector(".nav").classList.remove("opened");
        document.querySelector(".menu").classList.remove("opened");
    }, {once:true});
};



//RENT
if (document.querySelector(".rent-form__input_number")) {
    rent();
};

//Cabinet
if (document.querySelector(".Client__info")) {
    await cabinet();
};