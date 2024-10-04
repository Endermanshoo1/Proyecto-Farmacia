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



//tarjetas bebes
const contenedorTarjetasBebes = document.getElementById("bebes")

function crearTarjetaBebes(bebes){
    bebes.forEach(bebes =>{
        const nuevoProducto2 = document.createElement('div')
        nuevoProducto2.classList = "card"
        nuevoProducto2.innerHTML =
        `
        <div class= "imgBx">
                <img src="/${bebes.imagen}">
        </div>
        <div class=content>
            <div class="details">
            <h2 class="details">${bebes.nombre}</h2>
            <p class="details">${bebes.precio}</p>
            </div>
            <div class="botones">
                <span class="like"><i class='bx bx-like'></i></span>  
                <button class="carrito"><i class="bx bxs-cart-add"></i></button>
            </div>
        </div>
        `
        contenedorTarjetasBebes.appendChild(nuevoProducto2)
        nuevoProducto2.getElementsByTagName("button")[0].addEventListener("click",()=> agregarAlCarrito(bebes))
    })
}
async function obtenerProductosPorCategoria(categoria) {    
    try {  
        const response = await fetch(`/api/productos/categoria/${categoria}`);   
        if (!response.ok) {  
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);  
        }  
        const productos = await response.json();  
        
        crearTarjetaBebes(productos)
    } catch (error) {  
        console.error(`Error al obtener productos de la categoría ${categoria}:`, error);  
        contenedor.innerHTML = '<p>Error al cargar los productos de esta categoría.</p>';  
    }  
}  
obtenerProductosPorCategoria('bebes');        
