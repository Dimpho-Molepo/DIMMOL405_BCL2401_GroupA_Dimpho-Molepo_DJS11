import React from "react"
import { Link, NavLink } from "react-router-dom"
import "./CSS/Header.css"
import logo from "../assets/Podcast-Logo2.svg"
import { MdFavorite } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaArchive } from "react-icons/fa";
import Search from "../components/Search"


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

            <div>
                
                <Search/>

                <nav>

                <NavLink
                    to="/Favourites"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    <MdFavorite className="favourites" />
                   
                </NavLink>

                <NavLink
                    to="/History"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    <FaArchive  className="archive"/>
                    
                </NavLink>

                </nav>
            </div>
            
            
        </header>
    )
}