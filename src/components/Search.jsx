import { useState, useEffect } from "react"
import { useNavigate, createSearchParams } from "react-router-dom"
import searchButton from "../images/search-logo.svg"
export default function Search(props) {
    const [searchValue, setSearchValue] = useState("");
    const [placeholderText, setPlaceholderText] = useState("Search for movies, TV shows, etc.");
    const [path, setPath] = useState(props.path)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Search:" + searchValue);

        const searchQuery = {
            value: searchValue
        }

        const query = createSearchParams(searchQuery);

        navigate({
            pathname: `${path}/search`,
            search: `?${query}`
        })

    }

    const updatePlaceholder = () => {
        if (props.link == "/" || props.link == "") {
            setPlaceholderText("Search for movies, TV shows, etc.");
        }
        else if (props.link == "/movies") {
            setPlaceholderText("Search movie titles, genres, etc.");
        }
        else if (props.link == "/tvshows") {
            setPlaceholderText("Search TV show titles, genres, etc.");
        }
        else if (props.link == "/people") {
            setPlaceholderText("Search actors, directors, etc.");
        }
        else {
            setPlaceholderText("Search for movies, TV shows, etc.")
        }
    }


    useEffect(() => {
        updatePlaceholder();
    }, [props.link])
     

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleChange}
                    placeholder={placeholderText}></input>
                <div className="button" type="submit" onClick={handleSubmit}>
                    <img src={searchButton} alt="search"></img>
                </div>
            </form>
        </div>
    )
}