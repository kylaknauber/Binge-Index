import { useState, useEffect } from "react"
import Search from "./Search"
import {
    getMovieGenres, getPopularMovies,
    getNowPlayingMovies, getTopRatedMovies,
    getUpcomingMovies, getTrendingMovies
} from "../api/data"
import { Link } from "react-router-dom"
import RevealSection from "./RevealSection"

export default function MovieList() {
    const [url, setUrl] = useState("/movies");
    const [popular, setPopular] = useState([]);
    const [trending, setTrending] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [genres, setGenres] = useState([]);

    const popularMovies = async () => {
        try {
            const list = await getPopularMovies();
            list.pop();
            list.pop();
            list.pop();
            setPopular(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const trendingMovies = async () => {
        try {
            const list = await getTrendingMovies();
            list.pop();
            list.pop();
            setTrending(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const nowPlayingMovies = async () => {
        try {
            const list = await getNowPlayingMovies();
            list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            while (list.length > 17) {
                list.pop();
            }
            setNowPlaying(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const topRatedMovies = async () => {
        try {
            const list = await getTopRatedMovies();
            list.sort((a, b) => b.vote_average - a.vote_average);
            while (list.length > 17) {
                list.pop();
            }
            setTopRated(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const upcomingMovies = async () => {
        try {
            const list = await getUpcomingMovies();
            list.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingList = list.filter(movie => {
                const release = new Date(movie.release_date + "T00:00:00");
                return release > today;
            })
            while (upcomingList.length > 17) {
                upcomingList.pop();
            }
            setUpcoming(upcomingList);
        }
        catch (error) {
            console.log(error);
        }
    }

    const movieGenres = async () => {
        try {
            const list = await getMovieGenres();
            setGenres(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        popularMovies();
        trendingMovies();
        nowPlayingMovies();
        topRatedMovies();
        upcomingMovies();
        movieGenres();
    }, [])

    const popularElements = popular.map(movie => {
        const genreElements = genres.filter(genre => movie.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        return (
            <Link key={movie.id}
                to={`/movies/id/${movie.id}`}>
                <div key={movie.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`${movie.title} poster`}></img>
                    </div>
                    <h3>{movie.title}</h3>
                    <div className="genre-container">
                        <p>{genreElements.length > 1 ? `Genres: ${genreNames}` : `Genre: ${genreNames}`}</p></div>
                </div>
            </Link>
        )
    })

    const nowPlayingElements = nowPlaying.map(movie => {
        const genreElements = genres.filter(genre => movie.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        const releaseDate = movie.release_date;
        const localDate = new Date(releaseDate + "T00:00:00")
        const formattedDate = localDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        return (
            <Link key={movie.id}
                to={`/movies/id/${movie.id}`}>
                <div key={movie.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`${movie.title} poster`}></img>
                    </div>
                    <h3>{movie.title}</h3>
                    <div className="date-container">
                        <p>{`Release date: ${formattedDate}`}</p></div>
                </div>
            </Link>
        )
    })
    

    
    const topRatedElements = topRated.map(movie => {
        const ratingRounded = Math.round(movie.vote_average * 10) / 10;

        return (
            <Link key={movie.id}
                to={`/movies/id/${movie.id}`}>
                <div key={movie.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`${movie.title} poster`}></img>
                    </div>
                    <h3>{movie.title}</h3>
                    <div className="rating-container">
                        <p>{`Rating: ${ratingRounded}/10`}</p></div>
                </div>
            </Link>
        )
    })
     
    const upcomingElements = upcoming.map(movie => {
        const genreElements = genres.filter(genre => movie.genre_ids.includes(genre.id));
        const genreNames = genreElements.map(g => g.name).join(", ");

        const releaseDate = movie.release_date;
        const localDate = new Date(releaseDate + "T00:00:00")
        const formattedDate = localDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        return (
            <Link key={movie.id}
                to={`/movies/id/${movie.id}`}>
                <div key={movie.id}
                    className="show-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`${movie.title} poster`}></img>
                    </div>
                    <h3>{movie.title}</h3>
                    <div className="date-container">
                        <p>{`Release date: ${formattedDate}`}</p></div>
                </div>
            </Link>
        )
    })
    

    return (
        <>
            {popular.length > 0 && upcoming.length > 0 && topRated.length > 0 && nowPlaying.length > 0 && genres.length > 0 ?
                <div className="content-container">
                    <Search link={url}
                        path="/movies" />
                    <div className="media-container">
                        <RevealSection classSection="section-title">
                            <h1 className="section-title">Popular Movies</h1>
                        </RevealSection>
                        <RevealSection classSection="movieMedia">
                            {popularElements}
                            <Link className="view-more"
                                to={`/movies/category/popular`}>
                                <p>View</p>
                                <p>More...</p>
                            </Link>
                        </RevealSection>
                        <RevealSection classSection="section-title">
                            <h1 className="section-title">Now Playing</h1>
                        </RevealSection>
                        <RevealSection classSection="movieMedia">
                            {nowPlayingElements}
                            <Link className="view-more"
                                to={`/movies/category/now-playing`}>
                                <p>View</p>
                                <p>More...</p>
                            </Link>
                        </RevealSection>
                        <RevealSection classSection="section-title">
                            <h1 className="section-title">Top Rated</h1>
                        </RevealSection>
                        <RevealSection classSection="movieMedia">
                            {topRatedElements}
                            <Link className="view-more"
                                to={`/movies/category/top-rated`}>
                                <p>View</p>
                                <p>More...</p>
                            </Link>
                        </RevealSection>
                        <RevealSection classSection="section-title">
                            <h1 className="section-title">Upcoming</h1>
                        </RevealSection>
                        <RevealSection classSection="movieMedia">
                            {upcomingElements}
                        </RevealSection>
                    </div>
                </div>
                :
                <div>Loading...</div>
        }
        </>
    )
}