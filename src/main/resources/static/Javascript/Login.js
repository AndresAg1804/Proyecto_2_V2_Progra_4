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
async function go_to_loginJS(){

    await checkuser();

    if (!loginstate.logged && document.location.pathname != "/Pages/LoginPage/LoginView.html") {
        document.location = "/Pages/LoginPage/LoginView.html";
    }
    mainrender();
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
            else if (loginstate.Usuarios.proveedoresByIdprov.aprobado==true){
                document.location="/Pages/FacturarPage/FacturarView.html";
            }
            else if(loginstate.Usuarios.proveedoresByIdprov.aprobado==false){
                    await logout();
                    errorMessage(401);
            }

        }
    })();

}

function logout(event){
    if(event!=null) {
        event.preventDefault();
    }

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

