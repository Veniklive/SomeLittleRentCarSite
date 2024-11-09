//Update Price
        function updatePrice(){
            const quantityDays = document.querySelector(".rent-form__counter");
            const getPrice = document.querySelector(".swiper-slide.swiper-slide-active").querySelector(".price");
            const setPrice = document.querySelector(".rent-form__display");
            setPrice.innerHTML=parseInt(getPrice.innerHTML)*parseInt(quantityDays.innerHTML)+" грн";
        }

export async function rent(){

    const formPopup = document.querySelector(".popup-bg");
    const formTextPopup = document.querySelector(".popup");

    formPopup.addEventListener("click", function () {
        document.querySelector(".popup-bg").classList.remove("open");
        document.querySelector(".popup").classList.remove("open");
    });


    
        //ПЕРЕВІРКА РАЄСТРАЦІЇ ТА ДОДАННЯ КНОПОК
        new Promise(async (resolve) => {
            let response = await fetch(`http://localhost:5015/protected`, {
                method:"GET", 
                mode: "cors",
                credentials: "include"
            });
            
            if (response.status==401){
                const search_button = await document.querySelector('.rent-form');
                search_button.innerHTML +=
                `
                <button class="button open-popup Auth" name="cmdAuth" type="submit"><span>Реєстрація</span></button>
                `
                const buttonAuth = document.querySelector(".button.open-popup.Auth");
                buttonAuth.onclick = async function(){
                    window.location.href=`http://localhost:5015/auth/google`;
                    console.log("auth");
                };
        
            }
            else{
                let data = await response.json();
                const search_row = await document.querySelector('.rent-form');
                    search_row.innerHTML +=
                    `   <div class="rent-form__input_tel">
                        <div class="rent-form__title">Введіть номер телефону:</div>
                        <input required type="tel" name="Телефон" minlength="12" maxlength="12" class="rent-form__tel" placeholder="380YYXXXXXXX" value="">
                        </div>
                        <button class="button open-popup" name="cmdPost" type="submit"><span>Відправити заяву</span></button>
                    `;
                    //Phone
                    const phoneBlock = document.querySelector(".rent-form__input_tel");
                    phoneBlock.addEventListener("keyup",(event)=>{
                    let target = event.target;

                    if (target.value.length==12) {
                        target.classList.add("valid");
                        target.classList.remove("invalid");
                        event.target.closest(".rent-form__tel").classList.add("active");

                    }else if(target.value.length>12){
                        target.value = target.value.slice(0, 12);
                    } else{target.classList.add("invalid");  
                        target.classList.remove("valid");
                        event.target.closest(".rent-form__tel").classList.remove("active");
                    }   
                });
                //БАТОН
                const buttom = document.querySelector(".open-popup");
                buttom.onclick = function() {
                    const phone = document.querySelector(".rent-form__tel").value;
                    const id = document.querySelector(".swiper-slide.swiper-slide-active").querySelector(".hide").innerHTML;
                    const car_name = document.querySelector(".swiper-slide.swiper-slide-active").querySelector(".swiper-name").innerHTML;
                    const days = document.querySelector(".rent-form__counter").innerHTML;
                    const price = document.querySelector(".rent-form__display").innerHTML;
                    const quantityCar = document.querySelector(".swiper-slide.swiper-slide-active").querySelector(".quantityCar").innerHTML;

                    if (document.querySelectorAll(".selected")) {
                    if (document.querySelectorAll(".active").length==1 && quantityCar>=1 && document.querySelector(".valid")) {
                        const name = data.name;
                        const email = data.email;
                        console.log(id, name, email, phone, days);
                        fetch(`http://localhost:5015/AddRent?car_id=${id}&client_name=${name}&client_email=${email}&client_number=${phone}&number_days_rent=${days}`);
                        formPopup.classList.add("open");//activate Popup
                        formTextPopup.classList.add("open");//activate PopupText

                        const rentPopup = document.querySelector('.popup.open');
                        rentPopup.innerHTML =
                        `   <div class="popup_title_text">Ви відправили замовлення</div>
                            <div class="popup_text">Ваше ім'я: <span>${name}</span></div>
                            <div class="popup_text">Ваша пошта: <span>${email}</span></div>
                            <div class="popup_text">Ваш номер: <span>${phone}</span></div>
                            <div class="popup_text">Орендований транспорт: <span>${car_name}</span></div>
                            <div class="popup_text">Кількість днів оренди: <span>${days}</span></div>
                            <div class="popup_text">Вартість оренди: <span>${price}</span></div>
                        `;
                    }else{
                        formPopup.classList.add("open");//activate Popup
                        formTextPopup.classList.add("open");//activate PopupText

                        const rentPopup = document.querySelector('.popup.open');
                        rentPopup.innerHTML =
                        `   <div class="popup_title_text">Ваше замовлення не відправлено</div>
                            <div class="popup_text"><span>Перевірте правильність введених даних. Можливо замовляємого автомобіля немає у наявності.</span></div>
                        `;
                    }}}
                resolve();
            }
                    //БАТОН НО +-
                const buttonPlus = document.querySelector(".rent-form__img.plus");
                const buttonMinus = document.querySelector(".rent-form__img.minus");            

                buttonPlus.onclick = function(){
                    const quantityDays = document.querySelector(".rent-form__counter");
                    if (parseInt(quantityDays.innerHTML)<30){
                        quantityDays.innerHTML=parseInt(quantityDays.innerHTML)+1;
                        updatePrice();
                    }
                };

                buttonMinus.onclick = function(){
                    const quantityDays = document.querySelector(".rent-form__counter");
                    if (parseInt(quantityDays.innerHTML)>1){
                        quantityDays.innerHTML=parseInt(quantityDays.innerHTML)-1;
                        updatePrice();
                    }
                };

                //Class
                const buttomClass = document.querySelector(".autoClass");
                buttomClass.onclick = function() {
                    formPopup.classList.add("open");//activate Popup
                    formTextPopup.classList.add("open");//activate PopupText

                    const rentPopup = document.querySelector('.popup.open');
                    rentPopup.innerHTML =
                    `   <div class="popup_title_text">Класи автомобілів</div>
                        <div class="popup_text">
                        А - мініавто;<br/>
                        В - маленькі авто;<br/>
                        С - середні авто;<br/>
                        D - великі легковики для сім'ї;<br/>
                        Е - авто бізнес-класу;<br/>
                        F - авто представницького класу;<br/>
                        G - перший спортивний клас (тісний задній ряд);<br/>
                        Н - другий спортивний клас (відкидний верх);<br/>
                        S - спортивні купе;<br/>
                        L - комфортні мінівени;<br/>
                        M - «пиріжки», «каблуки» на базі класів В і С;<br/>
                        J - кросовери, SUV.
                        </span></div>
                    `;
                }

                //Body
                const buttomBody = document.querySelector(".autoBody");
                buttomBody.onclick = function() {
                    formPopup.classList.add("open");//activate Popup
                        formTextPopup.classList.add("open");//activate PopupText

                        const rentPopup = document.querySelector('.popup.open');
                        rentPopup.innerHTML =
                        `
                        <div class="popup_title_text">Кузови автомобілів</div>
                        <div class="popup_rent_about">   
                            <div class="about">
                            <img class="about__img__body" src="./img/galleryTwo.jpg" alt="" /> <div class="about__text"> - Купе</div>
                            </div>
                        </div>


                        `;
                }


                //DataBASE
    new Promise(async (resolve) => {
        let response = await fetch(`http://localhost:5015/ShowDataBase`)
        let data = await response.json();
        
        var length = data.length;

        const search_row = await document.querySelector('.swiper-wrapper');

        for (const item of data) {
            search_row.innerHTML +=
            `
            <div class="swiper-slide" style="background: center / cover no-repeat url('${item.car_img}');">
                <div class="hide">${item.car_id}</div>
                <div class="swiper-name">${item.car_name}</div>
                <div class="swiper-fuel">Тип палива: <span>${item.fuel_name}</span></div>
                <div class="swiper-class">Класс: <span>${item.class}</span></div>
                <div class="swiper-body">Тип кузова: <span>${item.body_name}</span></div>
                <div class="swiper-seats">Кількість місць: <span>${item.number_of_seats}</span></div>
                <div class="swiper-quantity">Кількість доступних авто: <span class="quantityCar">${item.car_quantity}</span></div>
                <div class="swiper-price">Ціна за день: <span class="price">${item.car_price}</span></div>
            </div>
            `;
            length = length - 1;
        };
        //RENT
        const swiper = new Swiper('.swiper', {
            // Optional parameters
            loop: true,
            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // select all elements with the "active" class
        const activeDivs = document.querySelectorAll('.swiper-slide');
        updatePrice();

        // create a new MutationObserver for each element
        activeDivs.forEach(div => {
        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
            if (mutation.attributeName === 'class' && !mutation.target.classList.contains('swiper-slide-active')) {
                updatePrice();
            }
            }
        });

        observer.observe(div, { attributes: true });
        });

        if(length = 1){ resolve(); }
    });

        });

}