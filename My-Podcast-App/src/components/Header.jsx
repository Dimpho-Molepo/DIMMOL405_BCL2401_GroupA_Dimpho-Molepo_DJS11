import React from "react"
import { Link, NavLink } from "react-router-dom"
// import { RxAvatar } from "react-icons/rx";
import "./Header.css"
import logo from "../assets/Podcast-Logo2.svg"
import { FiSearch } from "react-icons/fi";
import { MdFavorite } from "react-icons/md";

export default function Header() {
    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <header>
            <Link  to="/">
                <img className="site-logo" src={logo} alt="" />
            </Link>
            <nav>
                {/* <NavLink
                    to="/host"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Home
                </NavLink> */}
                <NavLink
                    to="/Favourites"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    <FiSearch />
                    Search
                </NavLink>
                <NavLink
                    to="/vans"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    <MdFavorite />
                    Favourites
                </NavLink>
                {/* <Link to="login" className="login-link">
                    <RxAvatar className="login-icon"/>
                </Link> */}

            </nav>
        </header>
    )
}