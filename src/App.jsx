import { useState } from 'react'
import {
    RouterProvider, Route,
    createBrowserRouter, createRoutesFromElements
} from "react-router-dom";
import Root from "./components/Root"
import Home from "./components/Home"
import Show from "./components/Show"
import ShowList from "./components/ShowList"
import Header from "./components/Header"
import MovieList from "./components/MovieList"
import Movie from "./components/Movie"
import PeopleList from "./components/PeopleList"
import People from "./components/People"
import SearchResults from "./components/SearchResults"
import Profile from "./components/Profile"
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import Favorites from "./components/Favorites"
import MoreResults from './components/MoreResults';

const appRouter = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Root />}>
        <Route path="" element={<Home />} />
        <Route path="/movies" element={<MovieList />}>
            
        </Route>
        <Route path="/movies/id/:id" element={<Movie />}></Route>
        <Route path="/movies/category/:category" element={<MoreResults /> }></Route>
        <Route path="/tvshows" element={<ShowList />}>
        </Route>
        <Route path="/tvshows/id/:id" element={<Show />}></Route>
        <Route path="/tvshows/category/:category" element={<MoreResults />}></Route>
        <Route path="/people" element={<PeopleList />}>
        </Route>
        <Route path="/people/id/:id" element={<People />}></Route>
        <Route path="/people/category/:category" element={<MoreResults />}></Route>
        <Route path="/search" element={<SearchResults />}></Route>
        <Route path="/people/search" element={<SearchResults />}></Route>
        <Route path="/tvshows/search" element={<SearchResults />}></Route>
        <Route path="/movies/search" element={<SearchResults />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/favorites" element={<Favorites/> }></Route>
    </Route>
))

function App() {

  return (
    <>
        <RouterProvider router={appRouter} />
    </>
  )
}

export default App
