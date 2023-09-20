// Função para fazer o POST request e autenticar o usuário
function login() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const body = {
        username: username,
        password: password,
        email: email
    };

    // fetch("http://localhost:8080/api/auth/login", {
    //     method: "POST",
    //     // mode: 'no-cors',
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(body)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // Verifica se o login foi bem-sucedido
    //     if (data.accessToken && data.tokenType) {
    //         // Salva o token e o nome de usuário no localStorage
    //         localStorage.setItem("accessToken", data.accessToken);
    //         localStorage.setItem("username", body.username);

    //         // Mostra o botão para iniciar a leitura do joystick
    //         const startButton = document.querySelector("button");
    //         startButton.style.display = "block";

    //         console.log("Login bem-sucedido!");
    //     } else {
            
    //         console.log("Login falhou!");
    //     }
    // })
    // .catch(error => console.error("Erro no login:", error));

    // Mostra o botão para iniciar a leitura do joystick
    const startButton = document.querySelector("button");
    startButton.style.display = "block";
}