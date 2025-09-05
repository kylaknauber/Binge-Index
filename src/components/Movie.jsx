import { useParams, useNavigate } from "react-router-dom"
import { getSpecificMovie, getMovieGenres } from "../api/data"
import { useEffect, useState } from "react"
import { db, auth } from "../api/firebase"
import { setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import favoriteIcon from "../images/icons8-heart-50.png"
import favoriteIconActive from "../images/icons8-heart-48-filled.png"
export default function Movie() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [movieDetails, setMovieDetails] = useState({});
    const [genres, setGenres] = useState([]);
    const [genreNames, setGenreNames] = useState(null);
    const [releaseDateFormatted, setReleaseDateFormatted] = useState(null);
    const [ratingRounded, setRatingRounded] = useState(null);
    const [languages, setLanguages] = useState(null);
    const [countries, setCountries] = useState(null);
    const [collection, setCollection] = useState(null);
    const [production, setProduction] = useState(null);
    const [currentFavorites, setCurrentFavorites] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const specificMovie = async (id) => {
        try {
            const data = await getSpecificMovie(id);
            data.media_type = "movie";
            setMovieDetails(data);

            setGenreNames(data.genres.map(g => g.name).join(", "));

            const releaseDate = data.release_date;
            const localDate = new Date(releaseDate + "T00:00:00")
            setReleaseDateFormatted(localDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }));


            setRatingRounded(Math.round(data.vote_average * 10) / 10);
            if (data.spoken_languages) {
                setLanguages(data.spoken_languages.map(l => l.english_name).join(", "));

            }
            if (data.origin_country) {
                setCountries(data.origin_country?.map(item => item).join(", "));
            }
            if (data.belongs_to_collection) {
                setCollection(data.belongs_to_collection.name);
            }
            setProduction(data.production_companies);
            
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchMovieGenres = async () => {
        try {
            const list = await getMovieGenres();
            setGenres(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    /*
    genreNames = movieDetails.genres.map(g => g.name).join(", ");

    const releaseDate = movieDetails.release_date;
    const localDate = new Date(releaseDate + "T00:00:00")
    releaseDateFormatted = localDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    ratingRounded = Math.round(movieDetails.vote_average * 10) / 10;
    */

    const productionSection = production?.map(company => {
        const name = company.name;
        const logo = `https://image.tmdb.org/t/p/original${company.logo_path}`


        return (
            <div key={company.id} className="production">
                <div>
                    {company.logo_path ?
                        <img src={logo} alt={`${name} logo`}></img>
                        : <p>{name}</p>}
                </div>
            </div>
        )
    })

    useEffect(() => {
        specificMovie(id);
        fetchMovieGenres();

    }, []);

    useEffect(() => {
        isCurrentFavorite();
    }, [id, user]);

    const addToFavorites = async () => {
        if (user) {
            try {
                await updateDoc(doc(db, "users", user.uid), {
                    favorites: arrayUnion(movieDetails)
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
                    (item) => item.id !== movieDetails.id
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
                    setCurrentFavorites(data.favorites);
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

    

    console.log(movieDetails);
    
    return (
        <div className="show-card">
            {movieDetails &&
                <>
                    <div className="poster">
                        <img src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`} alt={`${movieDetails.title} poster`}></img>
                    </div>
                    <div className="details">
                        <div className="title-div">
                            <p className="title">{movieDetails.title}</p>
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
                        <div className="paragraph">
                            <p className="label">Overview: </p>
                            <p>{movieDetails.overview}</p>
                        </div>
                        <div className="show-link">
                            <p>Movie information: </p>
                            <a href={movieDetails.homepage}>{movieDetails.homepage}</a>
                        </div>
                        <div className="genres">
                            <p className="label">Genres: </p>
                            <p className="info">{genreNames}</p>
                        </div>
                        <div className="release-date">
                            <p className="label">Release date: </p>
                            <p className="info">{releaseDateFormatted}</p>
                        </div>
                        <div className="runtime">
                            <p className="label">Runtime: </p>
                            <p className="info">{movieDetails.runtime ? `${movieDetails.runtime} minutes` : "N/A"}</p>
                        </div>
                        <div className="rate">
                            <p className="label">Rating: </p>
                            <p className="info">{ratingRounded}/10</p>
                        </div>
                    </div>

                    <div className="more-details">
                    {movieDetails.belongs_to_collection && 
                        <div className="collection">
                            <h5>Collection: </h5>
                            <p>{collection}</p>
                        </div>
                    }
                        <div className="language">
                            <h5>Languages: </h5>
                            <p>{languages}</p>
                        </div>
                        <div className="prod-container">
                            <h5>Production: </h5>
                            <div className="helper" >{productionSection}</div>
                        </div>
                        <div className="countries">
                            <h5>Produced in: </h5>
                            <p>{countries}</p>
                        </div>
                    </div>
                </>
            }
            {!movieDetails &&
                <div>Loading...</div>
            }
        </div>
    )
}



