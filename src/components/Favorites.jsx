import { db, auth } from "../api/firebase"
import { useAuth } from "../contexts/AuthContext"
import { getDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
export default function Favorites() {
    const { user } = useAuth();

    const [favorites, setFavorites] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [favoriteTVShows, setFavoriteTVShows] = useState([]);
    const [favoritePeople, setFavoritePeople] = useState([]);

    /**
     * Asynchronous function which fetches the logged in
     * user's favorites data from the "users" document in
     * Firestore. If document exists, it sets and filters 
     * the favorites to then be displayed on screen
     */
    const getFavorites = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.favorites) {
                    setFavorites(data.favorites);
                    setFavoriteMovies(data.favorites.filter(item => item.media_type === "movie"));
                    setFavoriteTVShows(data.favorites.filter(item => item.media_type === "tvshow"));
                    setFavoritePeople(data.favorites.filter(item => item.media_type === "person"));
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Function which maps are the elements of the favorites array
     * to then display each as a Link element 
     */
    const allFavoriteElements = favorites.map(item => {
        const mediaType = item.media_type === "movie"
            ? "movies"
            : item.media_type === "tvshow"
                ? "tvshows"
                : "people";


        return (
            <Link key={item.id}
                to={`/${mediaType}/id/${item.id}`}>
                <div className={mediaType === "people"
                    ? "person-container" : "show-container"}>
                    {mediaType === "people" ?
                        <>
                            <div className="img-container">
                                <img src={`https://image.tmdb.org/t/p/original${item.profile_path}`} alt={`${item.name} poster`}></img>
                            </div>
                            <h3>{item.name}</h3>
                        </>
                        : mediaType === "movies"
                            ?
                            <>
                                <div className="img-container">
                                    <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={`${item.title} poster`}></img>
                                </div>
                                <h3>{item.title}</h3>
                                <div className="genre-container">
                                    <p>{item.genres?.length > 1 ? `Genres: ${item.genres?.map(g => g.name).join(", ")}` : `Genre: ${item.genres?.map(g => g.name).join(", ")}`}</p></div>
                            </>
                            :
                            <>
                                <div className="img-container">
                                    <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={`${item.name} poster`}></img>
                                </div>
                                <h3>{item.name}</h3>
                                <div className="genre-container">
                                    <p>{item.genres?.length > 1 ? `Genres: ${item.genres?.map(g => g.name).join(", ")}` : `Genre: ${item.genres?.map(g => g.name).join(", ")}`}</p></div>
                            </>
                    }
                </div>
            </Link>
        )
    });

    /**
     * Function which maps are the elements of the favorite movies array
     * to then display each as a Link element 
     */
    const favoriteMovieElements = favoriteMovies?.map(item => {
        return (
            <Link key={item.id}
                to={`/movies/${item.id}`}>
                <div className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={`${item.title} poster`}></img>
                    </div>
                    <h3>{item.title}</h3>
                    <div className="genre-container">
                        <p>{item.genres?.length > 1 ? `Genres: ${item.genres?.map(g => g.name).join(", ")}` : `Genre: ${item.genres?.map(g => g.name).join(", ")}`}</p></div>
                </div>
            </Link>
        )
    });

    /**
     * Function which maps are the elements of the favorite TV shows array
     * to then display each as a Link element 
     */
    const favoriteTVElements = favoriteTVShows?.map(item => {
        return (
            <Link key={item.id}
                to={`/tvshows/${item.id}`}>
                <div className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${item.poster_path}`} alt={`${item.name} poster`}></img>
                    </div>
                    <h3>{item.name}</h3>
                    <div className="genre-container">
                        <p>{item.genres?.length > 1 ? `Genres: ${item.genres?.map(g => g.name).join(", ")}` : `Genre: ${item.genres?.map(g => g.name).join(", ")}`}</p></div>
                </div>
            </Link>
        )
    });

    /**
     * Function which maps are the elements of the favorite people array
     * to then display each as a Link element 
     */
    const favoritePeopleElements = favoritePeople?.map(item => {
        return (
            <Link key={item.id}
                to={`/people/${item.id}`}>
                <div className="person-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${item.profile_path}`} alt={`${item.name} poster`}></img>
                    </div>
                    <h3>{item.name}</h3>
                </div>
            </Link>
        )
    })

    useEffect(() => {
        getFavorites();
    }, []);

    console.log(favoriteMovies);
    console.log(favoriteTVShows);
    console.log(favoritePeople);
    return (
        <div className="content-container">
            {favorites.length > 0 ? <div className="media-container">
                <h1>All Favorites</h1>
                <div className="favoriteMedia">
                    {allFavoriteElements}
                </div>
                {favoriteMovies.length > 0 &&
                <>
                    <h1>Favorite Movies</h1>
                    <div className="favoriteMedia">
                        {favoriteMovieElements}
                    </div>
                </>
                }
                {favoriteTVShows.length > 0 &&
                <>
                    <h1>Favorite TV Shows</h1>
                    <div className="favoriteMedia">
                        {favoriteTVElements}
                    </div>
                </>    
                }
                {favoritePeople.length > 0 &&
                <>
                    <h1>Favorite People</h1>
                    <div className="favoriteMedia">
                        {favoritePeopleElements}
                    </div>
                </>    
                }
            </div>
            : <h1>You don't have any favorite media</h1>}
        </div>
    )
}