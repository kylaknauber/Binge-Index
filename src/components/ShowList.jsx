import { useState, useEffect } from "react"
import Search from "./Search"
import {
    getAiringTodayTV, getPopularTV,
    getOnTheAirTV, getTopRatedTV, 
    getTVGenres
} from "../api/data"
import { Link } from "react-router-dom"
export default function ShowList() {
    const [url, setUrl] = useState("/tvshows");
    const [popular, setPopular] = useState([]);
    const [airingToday, setAiringToday] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [onTheAir, setOnTheAir] = useState([]);
    const [genres, setGenres] = useState([]);

    const popularTV = async () => {
        try {
            const list = await getPopularTV();
            while (list.length > 17) {
                list.pop();
            }
            setPopular(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const airingTodayTV = async () => {
        try {
            const list = await getAiringTodayTV();
            //list.sort((a,b) => )
            while (list.length > 17) {
                list.pop();
            }
            setAiringToday(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const topRatedTV = async () => {
        try {
            const list = await getTopRatedTV();
            //list.sort((a,b) => )
            while (list.length > 17) {
                list.pop();
            }
            setTopRated(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const onTheAirTV = async () => {
        try {
            const list = await getOnTheAirTV();
            while (list.length > 17) {
                list.pop();
            }
            setOnTheAir(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const tvGenres = async () => {
        try {
            const data = await getTVGenres();
            setGenres(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        popularTV();
        airingTodayTV();
        topRatedTV();
        onTheAirTV();
        tvGenres();
    }, []);

    const popularElements = popular.map(tvshow => {
        const genreElements = genres.filter(genre => tvshow.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        return (
            <Link key={tvshow.id}
                to={`/tvshows/id/${tvshow.id}`}>
                <div key={tvshow.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${tvshow.poster_path}`} alt={`${tvshow.name} poster`}></img>
                    </div>
                    <h3>{tvshow.name}</h3>
                    <div className="genre-container">
                        <p>{genreElements.length > 1 ? `Genres: ${genreNames}` : `Genre: ${genreNames}`}</p></div>
                </div>
            </Link>
        )
    })

    const topRatedElements = topRated.map(tvshow => {
        const genreElements = genres.filter(genre => tvshow.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        const ratingRounded = Math.round(tvshow.vote_average * 10) / 10;

        return (
            <Link key={tvshow.id}
                to={`/tvshows/id/${tvshow.id}`}>
                <div key={tvshow.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${tvshow.poster_path}`} alt={`${tvshow.name} poster`}></img>
                    </div>
                    <h3>{tvshow.name}</h3>
                    <div className="rating-container">
                        <p>{`Rating: ${ratingRounded}/10`}</p></div>
                </div>
            </Link>
        )
    })

    const airingTodayElements = airingToday.map(tvshow => {
        const genreElements = genres.filter(genre => tvshow.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        //const ratingRounded = Math.round(movie.vote_average * 10) / 10;

        return (
            <Link key={tvshow.id}
                to={`/tvshows/id/${tvshow.id}`}>
                <div key={tvshow.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${tvshow.poster_path}`} alt={`${tvshow.name} poster`}></img>
                    </div>
                    <h3>{tvshow.name}</h3>
                    <div className="genre-container">
                        <p>{genreElements.length > 1 ? `Genres: ${genreNames}` : `Genre: ${genreNames}`}</p></div>
                </div>
            </Link>
        )
    })

    const airingThisWeekElements = onTheAir.map(tvshow => {
        const genreElements = genres.filter(genre => tvshow.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        return (
            <Link key={tvshow.id}
                to={`/tvshows/id/${tvshow.id}`}>
                <div key={tvshow.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${tvshow.poster_path}`} alt={`${tvshow.name} poster`}></img>
                    </div>
                    <h3>{tvshow.name}</h3>
                    <div className="genre-container">
                        <p>{genreElements.length > 1 ? `Genres: ${genreNames}` : `Genre: ${genreNames}`}</p></div>
                </div>
            </Link>
        )
    })

    console.log(popular);
    console.log(topRated);
    console.log(airingToday);
    console.log(onTheAir);
    console.log(genres);

    return (
        <div className="content-container">
            <Search link={url}
                path="/tvshows" />
            <div className="media-container">
                <h1>Popular TV Shows</h1>
                <div className="showMedia">
                    {popularElements}
                    <Link className="view-more"
                        to={`/tvshows/category/popular`}>
                        <p>View</p>
                        <p>More...</p>
                    </Link>
                </div>
                <h1>Top Rated</h1>
                <div className="showMedia">
                    {topRatedElements}
                    <Link className="view-more"
                        to={`/tvshows/category/top-rated`}>
                        <p>View</p>
                        <p>More...</p>
                    </Link>
                </div>
                <h1>Airing Today</h1>
                <div className="showMedia">
                    {airingTodayElements}
                    <Link className="view-more"
                        to={`/tvshows/category/airing-today`}>
                        <p>View</p>
                        <p>More...</p>
                    </Link>
                </div>
                <h1>Airing This Week</h1>
                <div className="showMedia">
                    {airingThisWeekElements}
                    <Link className="view-more"
                        to={`/tvshows/category/airing-this-week`}>
                        <p>View</p>
                        <p>More...</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}