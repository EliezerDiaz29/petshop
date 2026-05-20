import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import './login.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.data.token);

            setMessage("Login realizado com sucesso.");

            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            setMessage("Email ou senha inválidos.");
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-card">
                <h1>Login</h1>

                {message && <p className="message">{message}</p>}

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;