import { getSpecificPerson, getTrendingPeople, getPopularPeople } from "../api/data"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { db, auth } from "../api/firebase"
import { setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import favoriteIcon from "../images/icons8-heart-50.png"
import favoriteIconActive from "../images/icons8-heart-48-filled.png"
export default function People() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [personDetails, setPersonDetails] = useState({});
    const [birthdayFormatted, setBirthdayFormatted] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const getPerson = async (id) => {
        try {
            const data = await getSpecificPerson(id);
            data.media_type = "person";
            const bday = data.birthday;
            const localDate = new Date(bday + "T00:00:00");
            setBirthdayFormatted(localDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }));

            setPersonDetails(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const addToFavorites = async () => {
        if (user) {
            try {
                await updateDoc(doc(db, "users", user.uid), {
                    favorites: arrayUnion(personDetails)
                });
                setIsFavorite(true);
                console.log("added to favorites for " + user.name);
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            navigate("/login")
        }
    }

    const removeFromFavorites = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const updatedFavorites = data.favorites.filter(
                    (item) => item.id !== personDetails.id
                );
                await updateDoc(doc(db, "users", user.uid), {
                    favorites: updatedFavorites
                });
            }
            setIsFavorite(false);
            console.log("removed from favorites");
        }
        catch (error) {
            console.log(error);
        }
    }

    const isCurrentFavorite = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.favorites) {
                    //setCurrentFavorites(data.favorites);
                    data.favorites.map(favorite => {
                        if (favorite.id === Number(id)) {
                            setIsFavorite(true);
                        }
                    })
                    console.log(data.favorites);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        isCurrentFavorite();
    }, [id, user]);

    useEffect(() => {
        getPerson(id);
    }, [])

    console.log(personDetails);

    return (
        <div className="person-card">
            {personDetails && 
            <>
                <div className="person-info">
                    <div className="poster">
                        <img src={`https://image.tmdb.org/t/p/original${personDetails.profile_path}` }></img>
                    </div>
                    <div className="person-details">
                        <div className="title-div">
                            <p className="title">{personDetails.name}</p>
                            {!isFavorite
                                ? <img
                                    className="favorite-button"
                                    onClick={addToFavorites}
                                    src={favoriteIcon}
                                    title="Add to favorites"></img>
                                : <img
                                    className="favorite-button-active"
                                    onClick={removeFromFavorites}
                                    src={favoriteIconActive}
                                    title="Remove from favorites"></img>
                            }
                        </div>
                        <div className="biography">
                            <p className="label">Bio: </p>
                            <p className="info">{personDetails.biography}</p>
                        </div>
                        <div className="knownFor">
                            <p className="label">Known for: </p>
                            <p className="info">{personDetails.known_for_department}</p>
                        </div>
                        <div className="gender">
                            <p className="label">Gender: </p>
                            <p className="info">{personDetails.gender === 1
                                ? "Female"
                                : personDetails.gender === 2
                                    ? "Male"
                                    : "N/A"}</p>
                        </div>
                        <div className="birthday">
                            <p className="label">Birthday: </p>
                            <p className="info">{birthdayFormatted}</p>
                        </div>
                        <div className="location">
                            <p className="label">Place of birth: </p>
                            <p className="info">{personDetails.place_of_birth}</p>
                        </div>
                    </div>
                </div>
            </>    
            }
            {!personDetails && 
                <div>Loading...</div>    
            }
        </div>
    )
}