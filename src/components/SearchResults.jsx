import { useLocation, useSearchParams, Link } from "react-router-dom"
import {
    searchMovieByTitle, searchPersonByName,
    searchTVShowByTitle, multiSearch
} from "../api/data"
import { useState, useEffect } from "react"
import Search from "./Search"
import defaultImage from "../images/default-image.webp"
import Pagination from "@mui/material/Pagination"

export default function SearchResults() {
    const location = useLocation();
    const [page, setPage] = useState(1);
    const [searchParams] = useSearchParams();
    const [url, setUrl] = useState("");
    const [numResults, setNumResults] = useState(null);
    const query = searchParams.get("value");

    const [searchResults, setSearchResults] = useState([]);

    const handlePageChange = (event, num) => {
        setPage(num);
    }

    const searchMovies = async (query) => {
        try {
            const data = await searchMovieByTitle(query, page);
            setNumResults(data.total_pages);
            setSearchResults(data.results.map(item => {
                return {
                    url: "movies",
                    data: item
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    }

    const searchTVShows = async (query) => {
        try {
            const data = await searchTVShowByTitle(query, page);
            setNumResults(data.total_pages);
            setSearchResults(data.results.map(item => {
                return {
                    url: "tvshows",
                    data: item
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    }

    const searchPeople = async (query) => {
        try {
            const data = await searchPersonByName(query, page);
            setNumResults(data.total_pages);
            setSearchResults(data.results.map(item => {
                return {
                    url: "people",
                    data: item
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    }

    const searchAll = async (query) => {
        try {
            const data = await multiSearch(query, page);
            
            console.log(data);
            setNumResults(data.total_pages);
            setSearchResults(data.results.map(item => {
                const type = item.media_type;

                return {
                    url: type === "movie"
                        ? "movies"
                        : type === "person"
                            ? "people"
                            : "tvshows",
                    data: item
                }
            }));
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (location.pathname === "/people/search") {
            console.log("Search people");
            searchPeople(query);
            setUrl("/people")
        }
        else if (location.pathname === "/movies/search") {
            console.log("Search movies");
            searchMovies(query);
            setUrl("/movies")
        }
        else if (location.pathname === "/tvshows/search") {
            console.log("Search tv shows");
            searchTVShows(query);
            setUrl("/tvshows")
        }
        else {
            console.log("Search all");
            searchAll(query);
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Optional: for a smooth scroll animation
        });
    }, [query, page, numResults]);

    console.log(searchResults);

    const searchElements = searchResults.map(result => {
        const url = result.url;
        const resultData = result.data;
        let type;
        if (url === "people") {
            type = "person";
        }
        else if (url === "movies") {
            type = "movie";
        }
        else {
            type = "tv"
        }

        return (
            <Link key={resultData.id}
                to={`/${url}/id/${resultData.id}`}>
                <div className="result-info">
                    <div className="image">
                        <img src={
                            type === "person" && resultData.profile_path !== null
                                ? `https://image.tmdb.org/t/p/original${resultData.profile_path}`
                                : (type === "movie" || type === "tv") && resultData.poster_path !== null
                                    ? `https://image.tmdb.org/t/p/original${resultData.poster_path}`
                                    : defaultImage}
                            alt=""></img>
                    </div>
                    <div className="result-details">
                        <p className="name">
                            {type === "movie"
                                ? resultData.title
                                : resultData.name}</p>
                        <p>{type === "tv"
                            ? "TV Show"
                            : type === "movie"
                                ? "Movie"
                                : "Person"}</p>
                        {type === "person" ?
                            <p>Gender: {resultData.gender === 1
                                ? "Female"
                                : resultData.gender === 2
                                    ? "Male"
                                    : "N/A"}</p>
                            : type === "movie"
                                ? <p>Release date: {resultData.release_date}</p>
                                : <p>First aired: {resultData.first_air_date}</p>
                        }

                    </div>
                </div>
            </Link>
        )
    })

    return (
        <div className="search-page">
            <div className="search-page-main-content">
                <Search className="searchDiv"
                    path=""
                />
                <h1>Showing results for "{query}"</h1>
                <div className="results-container">
                    {searchElements}
                </div>
            </div>
            {numResults > 1 && <Pagination
                className="paging"
                count={numResults}
                size="large"
                onChange={handlePageChange}
                page={page}
            />}
        </div>
    )
}