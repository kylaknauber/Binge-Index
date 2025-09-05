import { useParams, useNavigate } from "react-router-dom"
import {
    getSpecificTVDetails, getTVSeasonDetails,
    getTVEpisodeDetails
} from "../api/data"
import { useState, useEffect } from "react"
import { db, auth } from "../api/firebase"
import { setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore"
import { useAuth } from "../contexts/AuthContext"
import favoriteIcon from "../images/icons8-heart-50.png"
import favoriteIconActive from "../images/icons8-heart-48-filled.png"
import dropDownArrow from "../images/drop-down-arrow.svg"
import dropUpArrow from "../images/drop-up-arrow.svg"

export default function Show() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tvShowDetails, setTVShowDetails] = useState({});
    const [tvSeasons, setTVSeasons] = useState([]);
    const [tvEpisodes, setTVEpisodes] = useState([]);
    const [genreNames, setGenreNames] = useState(null);
    const [releaseDateFormatted, setReleaseDateFormatted] = useState(null);
    const [lastDateFormatted, setLastDateFormatted] = useState(null);
    const [firstEpisodeTitle, setFirstEpisodeTitle] = useState(null);
    const [nextEpisode, setNextEpsiode] = useState(null);
    const [networks, setNetworks] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [seasonDetails, setSeasonDetails] = useState([]);
    const [showEpisodes, setShowEpisodes] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);
    

    const specificTVShow = async (id) => {
        try {
            const data = await getSpecificTVDetails(id);
            data.media_type = "tvshow"

            setTVSeasons(data.seasons.filter(s => s.season_number !== 0));
            setGenreNames(data.genres.map(g => g.name).join(", "));

            const releaseDate = data.first_air_date;
            const localDate = new Date(releaseDate + "T00:00:00");
            setReleaseDateFormatted(localDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }));

            const lastDate = data.last_air_date;
            const localDate2 = new Date(lastDate + "T00:00:00");
            setLastDateFormatted(localDate2.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }));

            if (data.next_episode_to_air) {
                const nextDate = data.next_episode_to_air.air_date;
                const localDate3 = new Date(nextDate + "T00:00:00");
                setNextEpsiode(localDate3.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }));
            }

            setNetworks(data.networks.map(n => n.name).join(", "));

            setTVShowDetails(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const getFirstEpisodeTitle = async (id, season) => {
        try {
            const data = await getTVSeasonDetails(id, season);
            setFirstEpisodeTitle(data.episodes[0].name);
        }
        catch (error) {
            console.log(error);
        }
    }

    const tvSeasonDetails = async (id) => {
        try {
            const seasonPromises = tvSeasons.map(async (season) => {
                const data = await getTVSeasonDetails(id, season.season_number);
                return {
                    seasonNumber: season.season_number,
                    data,
                    isShown: false
                }
            })

            const results = await Promise.all(seasonPromises);
            setSeasonDetails(results);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        specificTVShow(id);
        getFirstEpisodeTitle(id, 1);
    }, []);

    useEffect(() => {
        if (tvSeasons) {
            tvSeasonDetails(id);
        }
    }, [tvSeasons])

    const toggleMoreDetails = () => {
        setShowMore(prev => !prev);

        console.log("Toggling more details");
        
    }

    const toggleShowEpisodes = (seasonNum) => {
        console.log("toggling season: " + seasonNum);
        setSeasonDetails(prev => {
            return {
                ...prev,
                [seasonNum-1]: {
                    ...prev[seasonNum-1],
                    isShown: !prev[seasonNum-1]?.isShown,
                }
            };
        });
    };

    const addToFavorites = async () => {
        if (user) {
            try {
                await updateDoc(doc(db, "users", user.uid), {
                    favorites: arrayUnion(tvShowDetails)
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
                    (item) => item.id !== tvShowDetails.id
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
    
    console.log(seasonDetails);
    
    const seasonDetailsElements = tvSeasons.map(season => {
        return (
            <section key={season.id}>
                <div className="season-info"
                    key={season.id}>
                    <div className="poster">
                        <img src={season.poster_path
                            ? `https://image.tmdb.org/t/p/original${season.poster_path}`
                            : "../src/images/default-image.webp"}></img>
                    </div>
                    <div className="non-poster">
                        <h4>{season.name}</h4>
                        <div className="section">
                            <p>Overview: {season.overview === "" || season.overview === null
                                ? "N/A"
                                : season.overview}</p>
                        </div>
                        <div className="section">
                            <p>Air date: {season.air_date}</p>

                        </div>
                        <div className="section">
                            <p>Episodes: {season.episode_count}</p>

                        </div>
                        <div className="section">
                            <p>Rating: {!season.vote_average || season.vote_average === 0
                                ? "N/A"
                                : (Math.round(season.vote_average * 10) / 10) + "/10"}</p>

                        </div>
                    </div>
                </div>
                {showMore && <div className="viewEpisodes">
                    <div className="toggleContainer"
                        onClick={() => toggleShowEpisodes(season.season_number)}>
                        <img src={seasonDetails[season.season_number-1] && seasonDetails[season.season_number-1].isShown
                            ? dropUpArrow
                            : dropDownArrow} alt=""></img>
                        <h5>{seasonDetails[season.season_number-1] && seasonDetails[season.season_number-1].isShown
                            ? "Hide episode details"
                            : "View episode details"}</h5>
                    </div>
                    {seasonDetails && seasonDetails[season.season_number-1].isShown &&
                        <div className="episode-container">
                            {seasonDetails[season.season_number-1].data.episodes.map(episode => (
                                
                                <div className="episode-info"
                                    key={episode.id}>
                                    <h4>Episode {episode.episode_number}: "{episode.name}"</h4>
                                    <p>Overview: {episode.overview === null || episode.overview === ""
                                        ? "N/A"
                                        : episode.overview}</p>
                                    <p>Air date: {episode.air_date}</p>
                                </div>
                            ))}
                        </div>
                    }
                </div>}
            </section>
        )
    })
    

    console.log(tvShowDetails);
    console.log(tvSeasons);

    return (
        <div className="tvshow-card">
            {tvShowDetails && 
            <>
                <div className="main-tv-info">
                    <div className="poster">
                        <img src={`https://image.tmdb.org/t/p/original${tvShowDetails.poster_path}`}></img>
                    </div>
                    <div className="tvDetails">
                        <div className="title-div">
                            <p className="title">{tvShowDetails.name}</p>
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
                        <div className="tv-paragraph">
                            <p className="label">Overview: </p>
                            <p className="info">{tvShowDetails.overview}</p>
                        </div>
                        
                        <div className="genre">
                            <p className="label">Genres: </p>
                            <p className="info">{genreNames}</p>
                        </div>
                        <div className="seasons">
                            <p className="label">Seasons: </p>
                            <p className="info">{tvShowDetails.number_of_seasons}</p>
                        </div>
                        <div className="episodes">
                            <p className="label">Total Episodes: </p>
                            <p className="info">{tvShowDetails.number_of_episodes}</p>
                        </div>
                        <div className="firstEp">
                            <p className="label">First Episode: </p>
                            <p className="info">{releaseDateFormatted} ("{firstEpisodeTitle}")</p>
                        </div>
                        <div className="lastEp">
                            <p className="label">{tvShowDetails.status === "Returning Series"
                                ? "Latest Episode: "
                                : "Last Episode: "}</p>
                            <p className="info">{lastDateFormatted} ("{tvShowDetails.last_episode_to_air?.name}")</p>
                        </div>
                        {tvShowDetails.next_episode_to_air &&
                            <div className="nextEp">
                                <p className="label">Next episode: </p>
                                <p className="info">{nextEpisode}</p>
                            </div>    
                        }
                        <div className="network">
                            <p className="label">Network: </p>
                            <p className="info">{networks}</p>
                        </div>
                    </div>
                    <div className="more-tvDetails">
                        <div className="creators">
                            <p className="label">Created by: </p>
                            <p className="info">{tvShowDetails.created_by?.map(p => p.name).join(", ")}</p>
                        </div>
                        <div className="languages">
                            <p className="label">Languages: </p>
                            <p className="info">{tvShowDetails.spoken_languages?.map(l => l.english_name).join(", ")}</p>
                        </div>
                        <div className="production">
                            <p className="label">Production companies: </p>
                            <div className="helper">Hi</div>
                        </div>
                        <div className="countries">
                            <p className="label">Produced in: </p>
                            <p className="info">{tvShowDetails.origin_country?.map(c => c).join(", ")}</p>
                        </div>
                    </div>
                </div>
                <div className="extra-info">
                    {!showMore &&
                        <div className="show-more-container"
                            onClick={toggleMoreDetails}>
                            <img src={dropDownArrow} alt=""></img>
                            <h5>View more details</h5>
                        </div>   
                    }
                    {showMore && 
                        <div className="more-container">
                            <div className="show-less-container"
                                onClick={toggleMoreDetails}>
                                <img src={dropUpArrow} alt=""></img>
                                <h5>View less details</h5>
                            </div>

                            <div className="more-details">
                                <div className="season-div">
                                    {seasonDetailsElements}
                                </div>
                            </div>
                        </div>    
                    }
                </div>
            </>   
            }
            {!tvShowDetails &&
                <div>Loading...</div>
            }
        </div>
    )
}