import "../index.css"
import { useState, useEffect } from "react"
import Profile from "./Profile"
import { Link, useNavigate, useLocation } from "react-router-dom"
import defaultUserIcon from "../images/default-user.webp"
import { useAuth } from "../contexts/AuthContext"
import favoriteIcon from "../images/icons8-heart-48-filled.png"
import { storage } from "../api/firebase"
import { ref, getDownloadURL } from "firebase/storage";
import Logo from "../images/logo.png"

export default function Header() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    // add more
    const isSpecialPage = currentPath === "/favorites"
        ? true
        : currentPath === "/profile"
            ? true
            : currentPath.includes("category")
                ? true
                : false
    const [profilePic, setProfilePic] = useState(defaultUserIcon);

    /**
     * Function which checks if there is a user
     * currently logged and navigates to the specified page
     * whenever the profile icon is clicked. 
     */
    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
        }
        else {
            navigate("/login")
        }
    }

    /**
     * Function which checks if there is a user
     * currently logged and navigates to the specified page
     * whenever the favorites icon is clicked. 
     */
    const handleFavoritesClick = () => {
        if (user) {
            navigate("/favorites");
        }
        else {
            navigate("/login");
        }
    }

    /**
     * Fetches for the user's profile photo to display
     * If it does not exist, returns, and keeps the default profile icon
     */
    const getProfilePhoto = async () => {
        /**
         * const profileImageRef = ref(storage, `images/${user.uid}/profile-picture`);
        if(!profileImageRef) {
            setProfilePic(defaultUserIcon);
            return;
        }
         */

        try {
            const profileImageRef = ref(storage, `images/${user.uid}/profile-picture`);
            const url = await getDownloadURL(profileImageRef);
            console.log("URL: ", url);
            setProfilePic(url);
        }
        catch (error) {
            setProfilePic(defaultUserIcon);
            console.log("Error downloading image", error);
        }

    }
    
    useEffect(() => {
        if(user) {
            getProfilePhoto();
        }
        else {
            setProfilePic(defaultUserIcon);
        }
        console.log(user);
    }, [user, location]);

    return (
        <>
            {!isSpecialPage && 
                <header>
                    <div className="logo">
                        <img src={Logo} alt="movie camera logo"></img>
                        <p>Binge Index</p>
                    </div>
                    <div className="profile-section">
                        <div className="favorites"
                            onClick={handleFavoritesClick}>
                            <img src={favoriteIcon}></img>
                            <p>Favorites</p>
                        </div>
                        <div className="profile"
                            onClick={handleProfileClick}>
                            <div>
                                <img src={profilePic}></img>
                            </div>
                            <p>Profile</p>
                        </div>
                    </div>
                </header>    
            }
        </>
    )
}