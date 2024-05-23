document.addEventListener("DOMContentLoaded",MAINRENDER_editme);
document.addEventListener("visibilitychange",load_TEST_INFO);
async function MAINRENDER_editme(event) {
    try{ await checkuser();} catch(error){return;}
    await mainrender();
    console.log(loginstate.Usuarios.usern);
    console.log(loginstate.Usuarios.pasw);
    console.log(loginstate.Usuarios.tipo);
    console.log(loginstate.Usuarios.proveedoresByIdprov.idP);
    console.log(loginstate.Usuarios.proveedoresByIdprov.nombreP);
    console.log(loginstate.Usuarios.proveedoresByIdprov.aprobado);
    await editMEevents();
}
function editMEevents(){
    var aux=loginstate.Usuarios.usern;
    document.querySelector('h2').textContent=aux+" profile";
    aux=loginstate.Usuarios.proveedoresByIdprov.idP;
    document.querySelector('#idPeditME').value=aux;

    document.querySelector('#editME').addEventListener('click',updateUser);
    document.getElementById("editMEbutton").addEventListener('click',updateUser);
}
function load_TEST_INFO(){
    if(loginstate.logged && document.location=="/Pages/editME/editMEview.html") {
        document.getElementById("nombreP").textContent = "";
        document.getElementById("pasw").textContent = "";
    }
}
function updateUser(){
    var nombreP=document.getElementById("nombreP").value;
    var pasw=document.getElementById("pasw").value;

    const request = new Request("http://localhost:8080/api"+"/user"+
        `/editME?nombreP=${nombreP}&pasw=${pasw}`,
        {method: 'POST', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {
            errorMessage(response.status);return;
        }
        else{
            document.location="/Pages/editME/editMEview.html";
        }
    })();

    //document.location="/Pages/editME/editMEview.html";
}