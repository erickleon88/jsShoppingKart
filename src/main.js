'use strict'
//Select div shop
let shop = document.getElementById('shop');

//Creamos la canasta vacia para contener los elementos del carrito o lo que asignamos al localstorage
let basket = JSON.parse(localStorage.getItem('data')) || [];

//ES6 Arrow Function
let generateShop = () => {
    return shop.innerHTML = shopItemsData.map((data) => {
        /*html*/
        let { id, name, price, desc, img } = data;
        let search = basket.find((x) => x.id === id) || [];
        return `<div id="product-id-${id}"class="item"> 
                <img width="220" src="${img}" alt="">
                    <div class="details">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        <div class="price-quantity">
                            <h2>${price}</h2>
                            <div class="buttons">
                                <i onclick="delItems(${id})" class="bi bi-dash-lg"></i>
                                <div id=${id} class="quantity">
                                <!--Si item es undefined pinta 0, si no, pues trae lo guardado en el localstorage-->
                                ${search.item === undefined ? 0 : search.item}
                                </div>
                                <i onclick="addItems(${id})" class="bi bi-plus-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>`;
    }).join(""); //con .join quitamos las comas de separacion del arreglo y
};

generateShop();

//CRUD
//ES6 Arrow Function Sintax
let addItems = (id) => {
    let selItem = id;
    //Buscamos si existe el id que se esta agregando
    let search = basket.find((x) => x.id === selItem.id);

    //Si la busqueda da undefined significa que no hay otro item con el mismo id, Agregamos el item al carrito
    if (search === undefined) {
        basket.push({
            id: selItem.id,
            item: 1
        });
    } else {  //Si ya existe un elemento con el mismo id, solo incrementamos la cantidad del producto
        search.item += 1
    }

    //Agregamos el contenido de la canasta al localstorage
    localStorage.setItem('data', JSON.stringify(basket));
    updateItems(selItem.id);
};

let delItems = (id) => {
    let selItem = id;
    let search = basket.find((x) => x.id === selItem.id);

    //Detiene la ejecucion de la funcion si search es undefined desde el inicio
    if(search === undefined) return;
    //Si la cantidad de items llega a 0 detenemos la funcion de quitar elementos
    else if (search.item === 0)
        return;
    else {  //Si ya existe un elemento con el mismo id, solo decrementamos la cantidad del producto
        search.item -= 1
    }

    updateItems(selItem.id);

    //Filtramos los elementos, mostramos/mantenemos solo los que si tengan al menos un item
    basket = basket.filter((x)=> x.item !== 0)
  
    //Guardamos en el localstorage
    localStorage.setItem('data', JSON.stringify(basket));

};

let updateItems = (id) => {
    let search = basket.find((x) => x.id === id);
    // console.log(search.item); //Visualizamos solo el value de item
    document.getElementById(id).innerHTML = search.item;
    allItems();
};

let allItems = () => {
    let kartIcons = document.getElementById('kartAmount');
    //Convertimos los items en un arreglo numerico, para luego sumarlos con la funcion reduce
    //Luego los inyectamos al icono en el html
    kartIcons.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

//La invocamos para que se ejecute siempre y nos haga un refrescado rapido de los items que tiene el carrito
allItems();

//Minuto donde me quede, Tema: pagina mostrar carrito https://youtu.be/cT_ZYrS3tKc?t=7141