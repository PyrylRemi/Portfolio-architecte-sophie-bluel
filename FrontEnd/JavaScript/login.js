


//========================= Etape 2.1
const token = localStorage.getItem("token");
    if (token) {
        window.location.replace("index.html");
    }  


    const loginForm = document.querySelector(".login-form");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const errorMessage = document.querySelector("#error-message");

        console.log("Email:", email);
        console.log("Mot de passe:", password);

        try {
            const response = await fetch("http://localhost:5678/api/users/login", 
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token); // Stocker le token
                window.location.href = "index.html"; // Rediriger après connexion
            } else {
                alert("Identifiant ou MDP incorect !");
                errorMessage.textContent = "Identifiants incorrects.";
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            errorMessage.textContent = "Erreur de connexion. Réessayez.";
        }
        
    });

