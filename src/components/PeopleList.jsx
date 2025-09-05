import { useState, useEffect } from "react"
import Search from "./Search"
import {
    getTrendingPeople, getPopularPeople,
    
} from "../api/data"
import { Link } from "react-router-dom"
export default function PeopleList() {
    const [url, setUrl] = useState("/people");
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);

    const trendingPeople = async () => {
        try {
            const data = await getTrendingPeople();
            setTrending(data.filter(person => person.name !== "Unknown" && person.profile_path !== null));
        }
        catch (error) {
            console.log(error);
        }
    }

    const popularPeople = async() => {
        try {
            const data = await getPopularPeople();
            setPopular(data.filter(person => person.name !== "Unknown" && person.profile_path !== null));
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        trendingPeople();
        popularPeople();
    }, []);

    const trendingElements = trending.map(person => {
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

    const popularElements = popular.map(person => {
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
            {popular !== null && trending !== null
                ?
                <div className="content-container">
                    <Search link={url}
                        path="/people" />
                    <div className="media-container">
                        <h1>Popular People</h1>
                        <div className="peopleMedia">
                            {popularElements}
                        </div>
                        <h1>Trending People</h1>
                        <div className="peopleMedia">
                            {trendingElements}
                        </div>
                    </div>
                </div>
                :
                <div>
                    Loading...
                </div>}
        </>
    )
}