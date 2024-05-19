document.addEventListener("DOMContentLoaded",MAINRENDERadm);

var Ustate ={
    Ulist: new Array(), //esta es la lsta de personas que se carga
    Uitem : {usern:"", pasw:"",tipo:"",proveedoresByIdprov:null},
    Umode: "" // ADD, EDIT
}
async function MAINRENDERadm(event) {
    try{ await checkuser();
        await mainrender();
        await cargarUlsit();
    } catch(error){
        return;
    }

}
function cargarUlsit(){ //metodo para obtener la lista actual de personas
    const request = new Request('http://localhost:8080/api'+'/user'+'/ALL', {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        Ustate.Ulist = await response.json();
        await render_list_usuarios();
    })();
}
async function render_list_usuarios(event) {
    var listado=document.getElementById("list"); //agarra la lista del dom
    listado.innerHTML=""; //limpia el html para volver a cargar la lista
    Ustate.Ulist.forEach( XXX=>renderEACHone(listado,XXX));
}
function renderEACHone(listado,item){
    var tr =document.createElement("tr");
    if(item.tipo=='PRO') {

            tr.innerHTML = `<td>${item.usern}</td>
					<td>${item.proveedoresByIdprov.idP}</td>
					<td>${item.proveedoresByIdprov.nombreP}</td>

					<td><input type="button" id="AprovarDesAprovar" value="${item.proveedoresByIdprov.aprobado}"></td>
					`;//0=fals 1=true
            tr.querySelector("#AprovarDesAprovar").addEventListener("click",async()=>{ await editApprove(item.usern);});
            listado.append(tr);
    }
}
async function editApprove(uservar){
    let Usuario={usern:uservar,
        pasw:null
    };
    //creando un OBJECTO user con atributos id y password los nombres de variables tiene que ser igual eso en definitiva
    const request = new Request('http://localhost:8080/api'+'/user'+'/AprovarDesAprovar', {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(Usuario)});
    await (async () => {
        const response = await fetch(request); //jsuto aqui, aqui se envia el request
        if (!response.ok) {
            errorMessage(response.status);
            return;
        }

    })();
    cargarUlsit();
}
