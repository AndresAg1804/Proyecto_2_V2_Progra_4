var api = backend + '/clientes';

var state = {
    list: new Array(),
    item: { nombreC: "", idC: "", correo: "", telefono: ""},
    mode: "" // ADD, EDIT
}

document.addEventListener("DOMContentLoaded",loaded);
document.addEventListener("visibilitychange",unloaded);

async function loaded(event){
    try{ await menu();} catch(error){return;} //esto renderiza el header

    document.getElementById("search").addEventListener("click",search); //boton de search en html
    document.getElementById("new").addEventListener("click",ask); //boton para abrir el menu de creacion de persona

    document.getElementById("itemoverlay").addEventListener("click",toggle_itemview);

    document.querySelector("#itemview #registrar").addEventListener("click",add);
    document.querySelector("#itemview #actualizar").addEventListener("click",update);
    document.querySelector("#itemview #cancelar").addEventListener("click",toggle_itemview);

    state_json=sessionStorage.getItem("personas");
    if(!state_json){
        fetchAndList();
    }
    else{
        state=JSON.parse(state_json);
        document.getElementById("nombreBusqueda").value=state.item.nombre;
        render_list();
    }

    //fetchAndList();
}

async function unloaded(event){
    if(document.visibilityState==="hidden" && loginstate.logged){
        sessionStorage.setItem("personas",JSON.stringify(state));
    }
}

function fetchAndList(){ //metodo para obtener la lista actual de personas
    const request = new Request(api, {method: 'GET', headers: { }});
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

function render_list(){
    var listado=document.getElementById("list"); //agarra la lista del dom
    listado.innerHTML=""; //limpia el html para volver a cargar la lista
    state.list.forEach( item=>render_list_item(listado,item)); //foreach de cada elemento en la lista
}

function render_list_item(listado,item){
    var tr =document.createElement("tr"); //crea un elemento tr nuevo para cada iteracion del foreach
    tr.innerHTML=`<td>${item.cedula}</td>
					<td>${item.nombre}</td>
					<td><img src='/images/${item.sexo}.png' class='icon' ></td>
					<td id='edit'><img src='/images/edit.png'></td>
                    <td id='delete'><img src='/images/delete.png'></td>
                    <td id='pdf'><a href='/api/personas/${item.cedula}/pdf' target = "_blank"><img src='/images/pdf.png' style="width: 15px"></a></td>` ; //cambia y agrega el html necesario para 1 linea de la tabla
    tr.querySelector("#edit").addEventListener("click",()=>{edit(item.cedula);});//para cada elemento con la clase edit y delete se les agrega el evento correspondiente
    tr.querySelector("#delete").addEventListener("click",()=>{remove(item.cedula);});
    listado.append(tr);//es como hacer un push con html?
}

function search(){ //funcion para el search
    nombreBusqueda = document.getElementById("nombreBusqueda").value; //agarra el valor del elemento del html
    state.item.nombre=nombreBusqueda;
    const request = new Request(api+`/search?nombre=${nombreBusqueda}`, //lo manda al RestController Personas
        {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        state.list = await response.json();
        render_list(); //renderiza la lista nuevamente con la info que recolecto
    })();
}
/*
* @GetMapping("/search")
    public List<Persona> findByNombre(@RequestParam String nombre) {
        return personaRepository.findByNombre(nombre);
    }
    *
    *
    *

 */

function ask(){
    empty_item(); //vacia todos los campos del objeto item
    toggle_itemview();//esto es para el pop up, se activa
    state.mode="ADD"; //entramos en modo add
    render_item();//renderiza el pop up
}

function toggle_itemview(){
    document.getElementById("itemoverlay").classList.toggle("active"); //alterna -> si no tiene el active lo agrega, si ya lo tiene lo quita
    document.getElementById("itemview").classList.toggle("active");
}

function empty_item(){
    state.item={cedula:"", nombre:"",sexo:""};
}

function render_item(){
    document.querySelectorAll('#itemview input').forEach( (i)=> {i.classList.remove("invalid");});
    document.getElementById("cedula").value = state.item.cedula;//iguala lo que se haya puesto en los campos en el html y lo iguala a lo que hay en la variable item
    document.getElementById("nombre").value = state.item.nombre;
    if ( (['M','F'].includes(state.item.sexo))){ //verfica que el campo de sexo y la iguala del item
        document.querySelector("input[name='sexo'][value='"+state.item.sexo+"']").checked=true;
    }
    else{
        document.querySelectorAll("input[name='sexo']").forEach( (r)=>{r.checked=false;});
    }
    if(state.mode=="ADD"){ //verifica que el modo sea add
        document.querySelector("#itemview #registrar").hidden=false;
    }
    else{
        document.querySelector("#itemview #registrar").hidden=true;
    }
    if(state.mode=="EDIT"){ //verifica que el modo sea add
        document.querySelector("#itemview #actualizar").hidden=false;
    }
    else{
        document.querySelector("#itemview #actualizar").hidden=true;
    }

}

function add(){
    load_item();
    if(!validate_item()) return;//verifica que todos los campos hayan sido seleccionados
    let request = new Request(api, {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(state.item)});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        toggle_itemview();//llama de nuevo al pop up para quitar el active
        fetchAndList();//actualiza la lista
    })();
}

/*
* @PostMapping()
    public void create(@RequestBody Persona persona) {
        try {
            personaRepository.save(persona);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
* */

function load_item(){
    state.item={ //solicita todos los campos y los iguala en item
        cedula:document.getElementById("cedula").value,
        nombre:document.getElementById("nombre").value,
        sexo:(document.querySelector("input[name='sexo']:checked"))?
            document.querySelector("input[name='sexo']:checked").value : ""
    };
}

function validate_item(){ //funcion para verificar que todos los campos hayan sido rellenados
    var error=false;

    document.querySelectorAll('input').forEach( (i)=> {i.classList.remove("invalid");});

    if (state.item.cedula.length==0){
        document.querySelector("#cedula").classList.add("invalid");
        error=true;
    }

    if (state.item.nombre.length==0){
        document.querySelector("#nombre").classList.add("invalid");
        error=true;
    }

    if ( !(['M','F'].includes(state.item.sexo))){
        document.querySelectorAll("input[name='sexo']").forEach(e=>e.classList.add("invalid"));
        error=true;
    }

    return !error;
}

//esta funcionalidad falta de implementar
function edit(id){ //este llama a la funcion de read para encontrar a una persona con el id x
    let request = new Request(backend+`/personas/${id}`,
        {method: 'GET', headers: {}});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        state.item = await response.json();
        toggle_itemview();
        state.mode="EDIT";
        render_item();
        fetchAndList();
    })();
}
/*
function add(){
    load_item();
    if(!validate_item()) return;//verifica que todos los campos hayan sido seleccionados
    let request = new Request(api, {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(state.item)});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        toggle_itemview();//llama de nuevo al pop up para quitar el active
        fetchAndList();//actualiza la lista
    })();
}
* */
function update() {
    load_item();

    if (!validate_item()) return; // verifica que todos los campos hayan sido seleccionados
    let request = new Request(api +`/update/${state.item.cedula}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.item)
    });
    (async () => {
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        toggle_itemview();//llama de nuevo al pop up para quitar el active
        fetchAndList();//actualiza la lista
    })();
}

function remove(id){
    let request = new Request(backend+`/personas/${id}`,
        {method: 'DELETE', headers: {}});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        fetchAndList();
    })();
}

/*
* @DeleteMapping("/{cedula}")
  public void delete(@PathVariable String cedula) {
      try {
          personaRepository.delete(cedula);
      } catch (Exception ex) {
          throw new ResponseStatusException(HttpStatus.NOT_FOUND);
      }
  }
* */
