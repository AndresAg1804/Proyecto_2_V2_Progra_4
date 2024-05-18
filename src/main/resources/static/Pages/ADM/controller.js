document.addEventListener("DOMContentLoaded",MAINRENDERadm);
var Ustate ={
    Ulist: new Array(), //esta es la lsta de personas que se carga
    Uitem : {cedula:"", nombre:"",sexo:""},
    Umode: "" // ADD, EDIT
}
async function MAINRENDERadm(event) {
    try{ await setEVENTES();} catch(error){return;}
    await cargarUlsit();
    await render_list_usuarios();
}
function cargarUlsit(){ //metodo para obtener la lista actual de personas
    const request = new Request('http://localhost:8080/api'+'/user'+'/ALL', {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        state.list = await response.json(); /*
         @GetMapping
         public List<Persona> read() {
        return personaRepository.findAll(); retorna la lista del repository
    }*/
        render_list(); //una vez cargada la lista llama a la funcion de render_list
    })();
}
async function render_list_usuarios(event) {
    var listado=document.getElementById("list"); //agarra la lista del dom
    listado.innerHTML=""; //limpia el html para volver a cargar la lista
    Ustate.Ulist.forEach( item=>render_list_item(listado,item));
}