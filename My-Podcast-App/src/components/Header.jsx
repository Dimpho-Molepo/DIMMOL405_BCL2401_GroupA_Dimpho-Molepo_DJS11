import React from "react"
import { Link, NavLink } from "react-router-dom"
import "./CSS/Header.css"
import logo from "../assets/Podcast-Logo2.svg"
import { MdFavorite } from "react-icons/md";
import { FaArchive } from "react-icons/fa";



export default function Header() {
    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616"
    }

    return (
        <header>
            <Link  to="/" className="home-link">
                <img className="site-logo" src={logo} alt={logo} />
            </Link>

            <div>
                
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