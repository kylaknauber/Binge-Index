import Search from "./Search"
import { useState, useEffect, useRef } from "react"
import {
    getPopularMovies, getPopularTVShows,
    getTrendingMovies, getTrendingTVShows,
    getTrendingPeople, getMovieGenres, getTVGenres
} from "../api/data"
import { Link } from "react-router-dom"
import { motion, useInView, useAnimation } from "framer-motion"
import RevealSection from "./RevealSection"
export default function Home() {
    const [url, setUrl] = useState("/");
    const [popularMovies, setPopularMovies] = useState([])
    const [popularTVShows, setPopularTVShows] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])
    const [trendingTVShows, setTrendingTVShows] = useState([])
    const [trendingPeople, setTrendingPeople] = useState([])
    const [movieGenres, setMovieGenres] = useState([])
    const [tvGenres, setTVGenres] = useState([])

    const popMovies = async () => {
        try {
            const list = await getPopularMovies();
            setPopularMovies(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const popTV = async () => {
        try {
            const list = await getPopularTVShows();
            setPopularTVShows(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const trendMovies = async () => {
        try {
            const list = await getTrendingMovies();
            list.pop();
            list.pop();
            setTrendingMovies(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const trendTV = async () => {
        try {
            const list = await getTrendingTVShows();
            list.pop();
            list.pop();
            setTrendingTVShows(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const trendPeople = async () => {
        try {
            const list = await getTrendingPeople();
            setTrendingPeople(list.filter(person => person.name !== "Unknown" && person.profile_path !== null));
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchMovieGenres = async () => {
        try {
            const list = await getMovieGenres();
            setMovieGenres(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    const fetchTVGenres = async () => {
        try {
            const list = await getTVGenres();
            setTVGenres(list);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        popMovies();
        popTV();
        trendMovies();
        trendTV();
        trendPeople();
        fetchMovieGenres();
        fetchTVGenres();
    }, [])

    const trendMovieElements = trendingMovies.map(movie => {
        const genreElements = movieGenres.filter(genre => movie.genre_ids.includes(genre.id));
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

    const trendTVElements = trendingTVShows.map(tvshow => {
        const genreElements = tvGenres.filter(genre => tvshow.genre_ids.includes(genre.id));
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

    const trendPeopleElements = trendingPeople.map(person => {
        return (
            <Link key={person.id}
                to={`/people/id/${person.id}`}>
                <div key={person.id}
                    className="person-container">
                    <div className="img-container">
                        <img src={`https://image.tmdb.org/t/p/original${person.profile_path}`} alt={`${person.name} poster`}></img>
                    </div>
                    <h3>{person.name}</h3>

                </div>
            </Link> 
        )
    })

    return (    
        <>
            {trendingMovies.length > 0 && trendingTVShows.length > 0 && trendingPeople.length > 0 ?
            <div className="content-container">
                <Search link={url}
                    path="" />
                <div className="media-container">
                    <RevealSection
                        classSection="section-title">
                        <h1 className="section-title">Trending Movies</h1>
                    </RevealSection>
                    <RevealSection classSection="homeMedia">
                        {trendMovieElements}
                    </RevealSection>
                    <RevealSection
                        classSection="section-title">
                        <h1 className="section-title">Trending TV Shows</h1>
                    </RevealSection>
                    <RevealSection classSection="homeMedia">
                        {trendTVElements}
                    </RevealSection>
                    <RevealSection
                        classSection="section-title">
                        <h1 className="section-title">Trending People</h1>
                    </RevealSection>
                    <RevealSection classSection="homeMedia">
                        {trendPeopleElements}
                    </RevealSection>
                </div>
            </div>
                :
            <div>Loading...</div>
            } 
        </> 
    )
}