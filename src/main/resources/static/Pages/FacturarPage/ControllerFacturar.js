var loginstate ={
    logged: false,
    user : {id:"", rol:""}
} //se esta volviendo a caer en la var loginstate original

document.addEventListener("DOMContentLoaded",MAINRENDER);
async function MAINRENDER(event) {
    try{ await mainrender();} catch(error){return;}
    await dos();
}

async function dos(){
    await checkuser();
    setEVENTES();
}
