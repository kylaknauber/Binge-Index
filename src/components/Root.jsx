import Header from "./Header"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { Outlet } from "react-router-dom"
export default function Root() {
    return (
        <div>
            <Header />
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    )
}