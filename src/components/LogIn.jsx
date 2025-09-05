import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../api/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = (e) => {
        e.preventDefault();

        console.log("Email: " + email);
        console.log("Password: " + password);
        userLogin(email, password);
    }

    const userLogin = async (email, password) => {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            navigate("/profile");
        }
        catch (error) {
            setError(error.message);
            console.error(error.message);
        }
    }

    return (
        <div className="logIn">
            {error && 
                <div className="errorMessage">
                    {error === "Firebase: Error (auth/invalid-email)."
                        ? "Invalid Email or Password"
                        : error === "Firebase: Error (auth/invalid-credential)."
                            ? "Account does not exist"
                            : error}
                </div>    
            }
            <h3>Log in</h3>
            <form onSubmit={handleLogin}>
                <label>Email
                    <input
                        type="text"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="e.g. johndoe@gmail.com"
                    ></input>
                </label>
                <label>Password
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="********"
                    ></input>
                </label>
                <button>Log in</button>
            </form>
            <div>
                <p>Don't have an account? </p>
                <Link to="/signup">Sign up</Link>
            </div>
        </div>
    )

}