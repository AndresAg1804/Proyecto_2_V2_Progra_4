var loginstate ={
    logged: false,
    user : {id:"", rol:""}
} //se esta volviendo a caer en la var loginstate original

document.addEventListener("DOMContentLoaded",MAINRENDER);
async function MAINRENDER(event) {
    try{ await checkuser();} catch(error){return;}
    await mainrender();
}

