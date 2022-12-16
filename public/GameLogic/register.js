const registerButton = document.getElementById("register-form");
const submitButton = document.getElementById("sub");
let messageDiv = document.createElement("div");

registerButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = registerButton.elements.username.value;
    const pass = registerButton.elements.password.value;
    const confirmPass = registerButton.elements.confirmPassword.value;

    if(pass === confirmPass){
        const response = await fetch("/processRegister", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user, pass})
        });

        messageDiv.innerText = "Waiting for confirmation!";
        messageDiv.classList.add("success");
        registerButton.appendChild(messageDiv);

        response.json().then(data => {
            console.log("status", data.status)
            if(data.status){
                messageDiv.innerText = "Successfully Registered!";
                messageDiv.classList.add("success");


                setTimeout(() => {
                    sessionStorage.setItem("username",data.user);
                    window.location.replace("/");
                },1000);
            
            }else{
                messageDiv.innerText = data.message;
                messageDiv.classList.add("errors");

                submitButton.disabled = false;

            }
        });
    }
    else{
        messageDiv.innerText = "Passwords Do Not Match!";
        messageDiv.classList.add("errors");

        registerButton.appendChild(messageDiv);
    }
});