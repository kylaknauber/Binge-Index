import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { db, auth } from "../api/firebase"
import { useNavigate } from "react-router-dom"
import defaultUserIcon from "../images/default-user.webp"

export default function SignUp() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSignup = (e) => {
        e.preventDefault();

        console.log("Signing up...");
        createNewUser(firstName, lastName, email, password);
    }

    /**
     * Creating a new user with Firebase Auth, and adding that user to the db
     */
    const createNewUser = async (firstName, lastName, email, password) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            const now = new Date();

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: firstName + " " + lastName,
                dateCreated: now.toLocaleString(),
                profileImage: defaultUserIcon
            });

            console.log("User " + user.email + " created and added to db!");
            navigate("/profile");
        }
        catch (error) {
            setError(error.message);
            console.error("Error during sign up: " + error.message);
        }
    }

    return (
        <div className="signUp">
            {error &&
                <div className="errorMessage">
                    {error === "Firebase: Password should be at least 6 characters (auth/weak-password)."
                        ? "Password must be at least 6 characters"
                        : error}
                </div>
            }
            <h3>Sign up</h3>
            <form onSubmit={handleSignup}>
                <label>First name
                    <input
                        type="text"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        placeholder="e.g. John"
                    ></input>
                </label>
                <label>Last name
                    <input
                        type="text"
                        value={lastName}
                        onChange={handleLastNameChange}
                        placeholder="e.g. Smith"
                    ></input>
                </label>
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
                <button>Sign up</button>
            </form>
        </div>
    )

}