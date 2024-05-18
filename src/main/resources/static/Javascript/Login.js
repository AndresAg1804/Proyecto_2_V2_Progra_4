var backend="http://localhost:8080/api";
var api_login=backend+'/login';//cual restcontroller

var loginstate ={
    logged: false,
    Usuarios : {usern:"",pasw:null, tipo:"",proveedoresByIdprov:null}
}

async function checkuser(){
    let request = new Request(api_login+'/ua', {method: 'GET'});
    const response = await fetch(request);//se manda, send
    if (response.ok) {
        loginstate.logged = true;
        loginstate.Usuarios = await response.json();
    }
    else {
        console.log("Okay we on checkuser ");
        loginstate.logged = false;
    }
}
async function one(){
    console.log("Okay we on login ");

    await checkuser();
    console.log("Okay we out of checkuser ");
    if (!loginstate.logged && document.location.pathname != "/Pages/LoginPage/LoginView.html") {
        document.location = "/Pages/LoginPage/LoginView.html";//Si no encuentra a nadie logedao lodeja en la pestana inicial
        //throw new Error("Usuario no autorizado");
    }
    setEVENTES();
}
function setEVENTES(){
    if (!loginstate.logged){
        html=`
            <div>
                <div>
                    <p>Facturación </p> <p>electronica</p></div>
<!--                <div><img class="logo" src="../../../static/Images/logo.png" alt=""/></div>-->
            </div>

            <ul class="Menu">
                <li>
                    <a href="#">Acerca De</a>
                </li>


            </ul>
        `;
        document.getElementById('header').innerHTML = html;
        document.getElementById('LoginB').addEventListener("click",login);

        document.getElementById("newU_A").addEventListener('click',MOVE2newUser);
        //ojo que si se hace un get element by ID que no existe error
    }
    else{
        html=`
            <div>
                <div>
                    <p>Facturación </p> <p>electronica</p></div>
<!--                <div><img class="logo" src="../../../static/Images/logo.png" alt=""/></div>-->
            </div>

            <ul class="Menu">
                <li>
                    <a id="LogoutA" class="LogoutA" href="#">Logout</a>
                </li>
                <li>
                    <a class="user" href="#">${loginstate.Usuarios.usern}</a>
                    <a class="user" href="#">${loginstate.Usuarios.proveedoresByIdprov.idP}</a>
                </li>
            </ul>
        `;
        document.getElementById('header').innerHTML = html;
        document.getElementById('LogoutA').addEventListener('click', logout);
        console.log("Okay we good");
    }

}
function login(){
    let Usuario={usern:document.getElementById("usern").value,
        pasw:document.getElementById("pasw").value
    };
    //creando un OBJECTO user con atributos id y password los nombres de variables tiene que ser igual eso en definitiva
    let request = new Request(api_login+'/login', {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Usuario)});

    //pero cuando envio el request ????
    (async ()=>{
        const response = await fetch(request); //jsuto aqui, aqui se envia el request
        if (!response.ok) {errorMessage(response.status);return;}
        await checkuser();
        if(loginstate.logged){
            if(loginstate.Usuarios.tipo=="ADM"){
                document.location="/Pages/ADM/ADMview.html";
            }
            else{
                document.location="/Pages/FacturarPage/FacturarView.html";
            }

        }
    })();
}

function logout(event){
    event.preventDefault();
    // Melvin que es esto ??
    let request = new Request(api_login+'/logout', {method: 'POST'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        document.location="/Pages/LoginPage/LoginView.html";
    })();
}
function MOVE2newUser(){
    document.location="/Pages/NewUser/NewuserView.html";
}

function errorMessage(status,place){
    switch(status){
        case 404: error= "Registro no encontrado"; break;
        case 409: error="Registro duplicado"; break;
        case 401: error="Usuario no autorizado"; break;
        case 403: error="Usuario no tiene derechos"; break;
    }
    window.alert(error);
}

