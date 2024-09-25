const cloud = document.getElementById("cloud");
const barraLateral = document.querySelector(".barra-lateral");
const spans = document.querySelectorAll("span");
const palanca = document.querySelector(".switch");
const circulo = document.querySelector(".circulo");
const menu = document.querySelector(".menu");
const main = document.querySelector("main");

menu.addEventListener("click",()=>{
    barraLateral.classList.toggle("max-barra-lateral");
    if(barraLateral.classList.contains("max-barra-lateral")){
        menu.children[0].style.display = "none";
        menu.children[1].style.display = "block";
    }
    else{
        menu.children[0].style.display = "block";
        menu.children[1].style.display = "none";
    }
    if(window.innerWidth<=320){
        barraLateral.classList.add("mini-barra-lateral");
        main.classList.add("min-main");
        spans.forEach((span)=>{
            span.classList.add("oculto");
        })
    }
});

palanca.addEventListener("click",()=>{
    let body = document.body;
    body.classList.toggle("dark-mode");
    body.classList.toggle("");
    circulo.classList.toggle("prendido");
});

cloud.addEventListener("click",()=>{
    barraLateral.classList.toggle("mini-barra-lateral");
    main.classList.toggle("min-main");
    spans.forEach((span)=>{
        span.classList.toggle("oculto");
    });
});


//cartas belleza

const contenedorTarjetasBelleza = document.getElementById("belleza")

function crearTarjetasBelleza(belleza){
    belleza.forEach(belleza =>{
        const nuevoProducto3 = document.createElement('div')
        nuevoProducto3.classList = "card"
        nuevoProducto3.innerHTML =
        `
        <div class= "imgBx">
                <img src="${belleza.img}">
        </div>
        <div class=content>
            <div class="details">
            <h2 class="details">${belleza.nombre}</h2>
            <p class="details">${belleza.precio}</p>
            </div>
            <div class="botones">
                <span class="like"><i class='bx bx-like'></i></span>  
                <button class="carrito"><i class="bx bxs-cart-add"></i></button>
            </div>
        </div>
        `
        contenedorTarjetasBelleza.appendChild(nuevoProducto3)
        nuevoProducto3.getElementsByTagName("button")[0].addEventListener("click",()=> agregarAlCarrito(belleza))
    })
}

crearTarjetasBelleza(belleza)
