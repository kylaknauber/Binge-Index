import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, db, storage } from "../api/firebase"
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext"
import { collection, getDoc, updateDoc, doc } from "firebase/firestore"
import defaultUserIcon from "../images/default-user.webp"
export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    
    const fileInputRef = useRef(null);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/");
        }
        catch (error) {
            console.log(error);
        }
    }
    // Uploading the file the user selected to storage
    // If the user already has a profile photo, the previous one gets replaced
    // with the new one, and the previous one is deleted.
    const changeProfilePhoto = async (img) => {
        // If user already has a profile photo, delete it
        if(image !== defaultUserIcon) {
            console.log("Deleting current image");
            const imageToDeleteRef = ref(storage, `images/${user.uid}/profile-picture`);
            try {
                await deleteObject(imageToDeleteRef);
            }
            catch(error) {
                console.log("Error deleting photo", error);
            }
        }

        const profileImagesRef = ref(storage, `images/${user.uid}/profile-picture`);
        try {
            const profileImgSnapShot = await uploadBytes(profileImagesRef, img);
            console.log("Successfully uploaded profile photo!", profileImgSnapShot);
        }
        catch (error) {
            console.log("Error uploading profile photo ", error);
        }

    }

    // Handles the user clicking to update the profile photo
    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result);
        reader.readAsDataURL(file);

        console.log(image);
        console.log(file);
        changeProfilePhoto(file);
    }

    const handleClick = () => {
        fileInputRef.current.click();
    }

    // Fetches for the user's profile photo to display
    // If it does not exist, returns, and keeps the default profile icon
    const getProfilePhoto = async () => {

        try {
            const profileImageRef = ref(storage, `images/${user.uid}/profile-picture`);
            const url = await getDownloadURL(profileImageRef);
            console.log("URL: ", url);
            setImage(url);
        }
        catch (error) {
            setImage(defaultUserIcon);
            console.log("Error downloading image", error);
        }

    }

    useEffect(() => {
        getProfilePhoto();
    }, [user]);

    console.log(user);

    return (
        <div className="profile-container">
            <div 
                className="profile-picture">
                <div onClick={handleClick}>
                    <img src={image}></img>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfilePhotoChange}
                    style={{ display: 'none' }}
                ></input>
                <p>Edit profile photo</p>
            </div>
            <div className="user-info">
                <h3>{user?.name}</h3>
                <div>
                    <p className="label">Email: </p>
                    <p className="info">{user?.email}</p>
                </div>
                <div>
                    <p className="label">Created: </p>
                    <p className="info">{user?.dateCreated}</p>
                </div>
                <button className="sign-out-button"
                    onClick={handleSignOut}>Sign out</button>
            </div>
            
        </div>
    )
}

/**
 * <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfilePhotoChange}
                    style={{ display: 'none' }}
                ></input>
 */