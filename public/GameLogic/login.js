let loginButton = document.getElementById("login-form");
let messageDiv = document.createElement("div");

loginButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = loginButton.elements.username.value;
    const pass = loginButton.elements.password.value;
    const response = await fetch("/processLogin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user, pass})
    });

    response.json().then(data => {
        if(data.status){
            messageDiv.innerText = "Successfully Logged In";
            messageDiv.classList.add("success");

            loginButton.appendChild(messageDiv);

            setTimeout(() => {
                sessionStorage.setItem("username",data.user);
                window.location.replace("/");
            },1000);
        }else{
            messageDiv.innerText = data.message;
            messageDiv.classList.add("errors");
            loginButton.appendChild(messageDiv);

        }
    });
});