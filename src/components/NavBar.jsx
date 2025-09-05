import {
    NavLink, useLocation,
    useNavigate
} from "react-router-dom"
import defaultUserIcon from "../images/icons8-test-account-30.png"
import favoriteIcon from "../images/icons8-heart-50-white.png"
import { useAuth } from "../contexts/AuthContext"

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const currentPath = location.pathname;
    const isDetailPage = /^\/[^/]+\/[^/]+$/.test(currentPath);
    // add more
    const isSpecialPage = currentPath === "/favorites"
        ? true
        : currentPath === "/profile"
            ? true
            : currentPath.includes("category")
                ? true
                : false
    console.log(currentPath);

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
        }
        else {
            navigate("/login")
        }
    }

    const handleFavoritesClick = () => {
        if (user) {
            navigate("/favorites");
        }
        else {
            navigate("/login");
        }
    }

    return (
        <>
            {!isSpecialPage ?
                <nav className="classic-nav">
                <NavLink to="/"
                    className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                    Home</NavLink>
                <NavLink to="/movies"
                    className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                    Movies</NavLink>
                <NavLink to="/tvshows"
                    className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                    TV Shows</NavLink>
                <NavLink to="/people"
                    className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                    People</NavLink>
                </nav>
                :
                <nav className="special-nav">
                    <p>Binge Index</p>
                    <div className="navLinks">
                        <NavLink to="/"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            Home</NavLink>
                        <NavLink to="/movies"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            Movies</NavLink>
                        <NavLink to="/tvshows"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            TV Shows</NavLink>
                        <NavLink to="/people"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            People</NavLink>
                    </div>
                    <div className="navExtra">
                        <div className="favorites"
                            onClick={handleFavoritesClick}>
                            <img src={favoriteIcon}></img>
                      
                        </div>
                        <div className="profile"
                            onClick={handleProfileClick}>
                            <div> 
                                <img src={defaultUserIcon}></img>
                            </div>
                        </div>
                    </div>
                </nav>
        }

        </>
    )
}

/**
 * {!isDetailPage ?
                <nav>
                    <NavLink to="/"
                        className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        Home</NavLink>
                    <NavLink to="/movies"
                        className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        Movies</NavLink>
                    <NavLink to="/tvshows"
                        className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        TV Shows</NavLink>
                    <NavLink to="/people"
                        className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                        People</NavLink>
                </nav>
                : 
                <nav className="detail-page-nav">
                    <div onClick={() => navigate(-1)} className="back-button">
                        <img src="../images/back-arrow.svg"></img>
                        <p>Back</p>
                    </div>
                </nav>
            }
 */

/**
                 * <nav className="special-nav">
                 *      <p>Binge Index</p>
                 *      <NavLink to="/"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            Home</NavLink>
                        <NavLink to="/movies"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            Movies</NavLink>
                        <NavLink to="/tvshows"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            TV Shows</NavLink>
                        <NavLink to="/people"
                            className={({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link"}>
                            People</NavLink>
                        <div>
                            <div className="favorites"
                                onClick={handleFavoritesClick}>
                                <img src={favoriteIcon}></img>
                                <p>Favorites</p>
                            </div>
                            <div className="profile"
                                onClick={handleProfileClick}>
                                <img src={defaultUserIcon}></img>
                                <p>Profile</p>
                            </div>
                        </div>
                 </nav>
                 */