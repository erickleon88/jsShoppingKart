'use strict'

let label = document.getElementById('label');
let shoppingKart = document.getElementById('shopping-kart');

//Traemos el contenido del localstorage
let basket = JSON.parse(localStorage.getItem('data')) || [];

let allItemsPrice = () => {
    let kartIcons = document.getElementById('kartAmount');
    kartIcons.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

allItemsPrice();

//Crear items del carrito
let genKartItems = () => {
    if (basket.length !== 0) {
        return shoppingKart.innerHTML = basket.map((x) => {
            let { id, item } = x;
            let search = shopItemsData.find((y) => y.id === id) || [];
            let {img, name, price} = search;
            //Card
            /*html*/
            return `
                <div class="kart-item">
                    <img width="100" src=${img} alt="">
                        <div class="details">

                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${name}</p>
                                    <p class="kart-item-price">$ ${price}</p>
                                </h4>
                                <i onclick="delCard(${id})" class="bi bi-x-lg"></i>
                            </div>   
                            <!--Componente Importado del main-->
                            <div class="buttons">
                                <i onclick="delItems(${id})" class="bi bi-dash-lg"></i>
                                <div id=${id} class="quantity">${item}</div>
                                <i onclick="addItems(${id})" class="bi bi-plus-lg"></i>
                            </div>
                            <!--FinComponente Importado del main-->
                            <h3>$ ${item * search.price}</h3>

                        </div>
                </div>
                
            `;
        }).join("");
    } else {
        shoppingKart.innerHTML = ``;
        /*html*/
        label.innerHTML = `<h2>Cart is Empty</h2>
                            <a href="index.html">
                                <button class="HomeBtn">Back To Home</button>
                            </a>`
    }
};

genKartItems();

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

    //Re-rendereamos el carrito
    genKartItems();

    updateItems(selItem.id);
    //Agregamos el contenido de la canasta al localstorage
    localStorage.setItem('data', JSON.stringify(basket));

};

let delItems = (id) => {
    let selItem = id;
    let search = basket.find((x) => x.id === selItem.id);

    //Detiene la ejecucion de la funcion si search es undefined desde el inicio
    if (search === undefined) return;
    //Si la cantidad de items llega a 0 detenemos la funcion de quitar elementos
    else if (search.item === 0)
        return;
    else {  //Si ya existe un elemento con el mismo id, solo decrementamos la cantidad del producto
        search.item -= 1
    }

    updateItems(selItem.id);

    //Filtramos los elementos, mostramos/mantenemos solo los que si tengan al menos un item
    basket = basket.filter((x) => x.item !== 0);

    genKartItems();
    TotalAmount();
    //Guardamos en el localstorage
    localStorage.setItem('data', JSON.stringify(basket));

};

let updateItems = (id) => {
    let search = basket.find((x) => x.id === id);
    // console.log(search.item); //Visualizamos solo el value de item
    document.getElementById(id).innerHTML = search.item;
    allItemsPrice();
    TotalAmount();
};

let clearKart = () =>{
    basket = [];
    genKartItems();
    allItemsPrice();
    localStorage.setItem('data', JSON.stringify(basket));
}

//Remover card completa
let delCard = (id) => {
    //Selecionamos el id del item que se va a borrar
    let selItem = id;
    //Filtramos todos los items que no sean ese id seleccionadp
    basket = basket.filter((x) => x.id !== selItem.id);
    //Rerendereamos el carrito sin el item
    genKartItems();
    TotalAmount();
    allItemsPrice();
    //Lo quitamos del localstorage y guardamos resultado
    localStorage.setItem('data', JSON.stringify(basket));
};


//Suma total del carrito
let TotalAmount = () => {
    genKartItems();
    //Vemos que el carrito tenga algo
    if (basket.length !== 0) {
        //Iteramos sobre los objetos para obtener los precios y cantidades de nuestra base de datos
        let amount = basket.map((x) => {
            let { item, id } = x;
            let search = shopItemsData.find((y) => y.id === id) || [];
            //Regresamos el total de la suma de items * el precio del objeto
            return item * search.price;
            //Sumamos el array, comenzando desde la posicion 0
        }).reduce((x, y) => x + y, 0);
    /*html*/    
    label.innerHTML = ` 
        <h2>Total Bill: $ ${amount}</h2>
        <button class="checkout">Checkout</button>
        <button onclick="clearKart()" class="removeAll">Remove All</button>
    `;
  
    } else return;
};

TotalAmount();

