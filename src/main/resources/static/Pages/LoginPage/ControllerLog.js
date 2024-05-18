document.addEventListener("DOMContentLoaded",LoginMAINRENDER);
async function LoginMAINRENDER(event) {
    try{ await mainrender();} catch(error){return;}
    await go_to_loginJS();
}
