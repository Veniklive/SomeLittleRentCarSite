export async function cabinet(){

//Кнопки реєстрації та виходу


new Promise(async (resolve) => {
    let response = await fetch(`http://localhost:5015/protected`, {
        method:"GET", 
        mode: "cors",
        credentials: "include"
    });
  
    if (response.status==401){
        const search_button = await document.querySelector('.button__Auth__and__Out');
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
        const search_row = await document.querySelector('.Client__info');
            search_row.innerHTML +=
            `   <div class="about">
                <img class="cabinet__img" referrerpolicy="no-referrer" src="${data.picture}" alt=""/>
                <div class="cabinet__text">
                <div class="cabinet__text__name">${data.name} ${data.surname}</div>
                <div class="cabinet__text__email">${data.email}</div>
                <div class="cabinet__text__ID">ID: ${data.id}</div>
                </div>
                </div>
            `;


            //DataBaseRentClient
            let responseClientInfo = await fetch(`http://localhost:5015/ShowClientsRents?client_email=${data.email}`)
            console.log(responseClientInfo);
            let dataClientInfo = await responseClientInfo.json();
            console.log(dataClientInfo);
            var length = dataClientInfo.length;

            const search_row_rent = await document.querySelector('.Client__rent__table');

            search_row_rent.innerHTML +=
                `
                <tr>
                    <th>№</th>
                    <th>Назва авто</th>
                    <th>Час подання заявки</th>
                    <th>Час взяття авто</th>
                    <th>Днів оренди</th>
                    <th>Ціна оренди</th>
                    <th>Статус оплати</th>
                </tr>
                `;
            console.log(dataClientInfo[0]);
            for (const item of dataClientInfo) {
                if(item.day_of_taken==null){item.day_of_taken="Авто чекає"}
                if(item.paid=="False"){item.paid="Несплачено"}
                if(item.paid=="True"){item.paid="Сплачено"}
                search_row_rent.innerHTML +=
                `
                    <tr>
                        <td>${item.rent_id}</td>
                        <td>${item.car_name}</td>
                        <td>${item.day_of_rent.slice(0,10)}</td>
                        <td>${item.day_of_taken}</td>
                        <td>${item.number_days_rent}</td>
                        <td>${item.car_price*item.number_days_rent}</td>
                        <td>${item.paid}</td>
                    </tr>
                `;
                length = length - 1;}

            const search_button = await document.querySelector('.button__Auth__and__Out');
            search_button.innerHTML +=
            `
            <button class="button open-popup Out" name="cmdOut" type="submit"><span>Вийти з акаунту</span></button>
            `
            const buttonOut = document.querySelector(".button.open-popup.Out");            
            buttonOut.onclick = async function(){
                let response = await fetch('http://localhost:5015/logout', {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include'
                });
                document.location.href=document.location.href;
                console.log("logout");
            };}
        resolve();
    });
    }