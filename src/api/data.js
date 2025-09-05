/**
 * This page includes various functions which
 * make various different API calls
 */

const API_TOKEN = import.meta.env.VITE_API_TOKEN_TMDB;
const API_KEY = import.meta.env.VITE_API_KEY_TMDB;

const getOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}`
    }
}

/**
 * Asynchronous function which fetches
 * the types of movie genres
 */
export const getMovieGenres = async () => { 
    try {
        const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', getOptions);
        const data = await response.json();
        return data.genres;
    }
    catch (error) {
        console.log("Error fetching data: " + error);
        throw error;
    }
     

    /**
     * fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', getOptions)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.error(err));
     */
}

/**
 * Asynchronous function which fetches
 * the types of TV show genres
 */
export const getTVGenres = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', getOptions);
        const data = await response.json();
        return data.genres;
    }
    catch (error) {
        console.log("Error fetching tv genres: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * the top 20 most popular movies
 */
export const getPopularMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching popular movies: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * the top 20 most popular TV shows
 */
export const getPopularTVShows = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching popular tv shows: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * the top 20 most trending movies
 */
export const getTrendingMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching popular tv shows: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * the top 20 most trending TV shows
 */
export const getTrendingTVShows = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/tv/day?language=en-US', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching popular tv shows: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * the top 20 most trending people
 */
export const getTrendingPeople = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/person/day?language=en-US', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching popular tv shows: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * movies currently playing in theaters
 */
export const getNowPlayingMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching now playing movies: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * the top 20 rated movies
 */
export const getTopRatedMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching top rated movies: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches
 * movies that are soon to be released
 */
export const getUpcomingMovies = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching upcoming movies: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which takes one parameter 
 * (id) in order to get more detailed information on a specific
 * movie, fetching by the movie ID
 */
export const getSpecificMovie = async (id) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, getOptions)
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching movie " + id + " details: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches 
 * TV Shows airing today
 */
export const getAiringTodayTV = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching airing tv: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches 
 * the top 20 most popular TV shows
 */
export const getPopularTV = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching popular tv: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches 
 * TV Shows airing this week
 */
export const getOnTheAirTV = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching on the air tv: " + error);
        throw error
    }
}

/**
 * Asynchronous function which fetches 
 * top 20 rated TV shows
 */
export const getTopRatedTV = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error fetching top rated tv: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which takes one parameter 
 * (id) in order to get more detailed information on a specific
 * TV show, fetching by the TV show ID
 */
export const getSpecificTVDetails = async (id) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching tv show: " + id + "details " + error);
        throw error;
    }
}

/**
 * Asynchronous function which takes two parameters 
 * (id, season) in order to get more detailed information on a specific
 * TV show season, fetching by tv show ID and season number
 */
export const getTVSeasonDetails = async (id, season) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}?language=en-US`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error getting tv season details: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which takes three parameters 
 * (id, season, episode) in order to get more detailed information on a specific
 * TV show episode, fetching by tv show ID, season number, and episode number
 */
export const getTVEpisodeDetails = async (id, season, episode) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}?language=en-US`, getOptions)
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error getting tv episode details: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches 
 * most popular people
 */
export const getPopularPeople = async () => {
    try {
        const response = await fetch('https://api.themoviedb.org/3/person/popular?language=en-US&page=1', getOptions);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.log("Error getting people list: " + error);
        throw error;
    }
}

/**
 * Asynchronous function which takes one parameter
 * (id) to get more detailed information on a specific
 * person, fetching by person ID
 */
export const getSpecificPerson = async (id) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}?language=en-US`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error getting person " + id + ": " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches a movie title
 * by the entered search query, and takes one parameter (query)
 */
export const searchMovieByTitle = async (query, pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error searching for movie: " + query + " - " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches a person's name
 * by the entered search query, and takes one parameter (query)
 */
export const searchPersonByName = async (query, pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error searching for person: " + query + " - " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches a TV show title
 * by the entered search query, and takes one parameter (query)
 */
export const searchTVShowByTitle = async (query, pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error searching for show: " + query + " - " + error);
        throw error;
    }
}

/**
 * Asynchronous function which fetches search results
 * based on the entered query, takes one parameter (query)
 */
export const multiSearch = async (query, pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error searching: " + query + " - " + error);
        throw error;
    }
}

export const allPopular = async (mediaType, pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/popular?language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching popular: ", error);
        throw error;
    }
}

export const allTopRated = async (mediaType, pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/top_rated?language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching top rated: ", error);
        throw error;
    }
}

export const getAllAiringTodayTV = async (pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching airing tv: " + error);
        throw error;
    }
}

export const getAllOnTheAirTV = async (pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching on the air tv: " + error);
        throw error
    }
}

export const getAllNowPlayingMovies = async (pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching now playing movies: " + error);
        throw error;
    }
}

export const getAllUpcomingMovies = async (pageNum) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${pageNum}`, getOptions);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error fetching upcoming movies: " + error);
        throw error;
    }
}