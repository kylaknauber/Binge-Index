import { useParams, Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import {
    allPopular, allTopRated, getAllAiringTodayTV,
    getAllOnTheAirTV, getAllNowPlayingMovies,
    getAllUpcomingMovies
} from "../api/data"
import Pagination from "@mui/material/Pagination"
import PaginationItem from "@mui/material/PaginationItem"
import defaultImage from "../images/default-image.webp"

export default function MoreResults() {
    const { category } = useParams();
    const location = useLocation();
    const currentPath = location.pathname;
    const [numResults, setNumResults] = useState(null);
    const [mediaData, setMediaData] = useState([]);
    const [page, setPage] = useState(1);
    const [pageTitle, setPageTitle] = useState("");
    const [resultsMessage, setResultsMessage] = useState("");
    const mediaType = currentPath.includes("movies")
        ? "movie"
        : currentPath.includes("tvshows")
            ? "tv"
            : "person"

    const getAllNumResults = async () => {
        if (mediaType === "movie") {
            if (category === "popular") {
                const data = await allPopular(mediaType, 1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                console.log(numResults);
                /**
                 * if (numResults) {
                    await getAllPopular(mediaType);
                    console.log(mediaData);
                }
                 */
                setPageTitle("Popular Movies");
            }
            else if (category === "top-rated") {
                const data = await allTopRated(mediaType, 1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("Top Rated Movies");
            }
            else if (category === "now-playing") {
                const data = await getAllNowPlayingMovies(1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("Now Playing Movies");
            }
            else {
                const data = await getAllUpcomingMovies(1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("Upcoming Movies");
            }
        }
        else if (mediaType === "tv") {
            if (category === "popular") {
                const data = await allPopular(mediaType, 1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("Popular TV Shows");
            }
            else if (category === "top-rated") {
                const data = await allTopRated(mediaType, 1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("Top Rated TV Shows");
            }
            else if (category === "airing-today") {
                const data = await getAllAiringTodayTV(1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("TV Shows Airing Today");
            }
            else {
                const data = await getAllOnTheAirTV(1);
                setNumResults(data.total_pages > 10 ? 10 : data.total_pages);
                setPageTitle("TV Shows Airing This Week");
            }
        }
        else {
            const data = await allPopular(mediaType, 1);
            setNumResults(data.total_pages > 5 ? 5 : data.total_pages);
            setPageTitle("Popular People");
        }

        console.log(category, mediaType, numResults);
    }

    const getResultsData = async (pageNum) => {
        if (category === "popular") {
            const data = await allPopular(mediaType, pageNum);
            if (data.results) {
                setMediaData(data.results);
                console.log(mediaData);
            }
        }
        else if (category === "top-rated") {
            const data = await allTopRated(mediaType, pageNum);
            if (data.results) {
                setMediaData(data.results);
                console.log(mediaData);
            }
        }
        else if (category === "now-playing") {
            const data = await getAllNowPlayingMovies(pageNum);
            data.results.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

            if (data.results) {
                setMediaData(data.results);
                console.log(mediaData);
            }
        }
        else if (category === "upcoming") {
            const data = await getAllUpcomingMovies(pageNum);
            if (data.results) {
                setMediaData(data.results);
                console.log(mediaData);
            }
        }
        else if (category === "airing-today") {
            const data = await getAllAiringTodayTV(pageNum);
            if (data.results) {
                setMediaData(data.results);
                console.log(mediaData);
            }
        }
        else if (category === "airing-this-week") {
            const data = await getAllOnTheAirTV(pageNum);
            if (data.results) {
                setMediaData(data.results);
                console.log(mediaData);
            }
        }
    }

    const handlePageChange = (event, num) => {
        setPage(num);
    }

    const mediaResultsElements = mediaData?.map(item => {
        let url = mediaType === "movie"
            ? "movies"
            : mediaType === "tv" 
                ? "tvshows"
                : "people"
        return (
            <Link
                to={`/${url}/id/${item.id}`}>
                <div key={item.id}
                    className={mediaType === "person" ? "person-container" : "show-container"}>
                    <div className="img-container">
                        <img
                            src={mediaType === "person" && item.profile_path !== null
                                ? `https://image.tmdb.org/t/p/original${item.profile_path}`
                                : mediaType === "movie" || mediaType === "tv" && item.poster_path !== null
                                    ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                                    : defaultImage} alt={`poster`}></img>
                    </div>
                    <h3>{mediaType === "movie"
                        ? item.title
                        : item.name}</h3>
                    {mediaType !== "person" &&
                        <div className="genre-container">
                            <p>genres</p></div>
                    }
                </div>
            </Link>
        )
    })

    useEffect(() => {
        getAllNumResults();
        getResultsData(page);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Optional: for a smooth scroll animation
        });
    }, [numResults, page])

    return (
        <div className="more-results-container-container">
            <h1 className="more-results-title">{pageTitle}</h1>
            
            <div className="more-results-container">
                <div className="content-container-more">
                    <div className="more-media-container">
                        {mediaResultsElements}
                    </div>
                </div>
                {numResults > 1 &&
                    <Pagination
                        className="paging"
                        count={numResults}
                        size="large"
                        onChange={handlePageChange}
                        page={page}
                    />
                }
            </div>
        </div>
    )
}