import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Home.css"
import { genreInfo, genresObject } from "../Genre";


export default function Home() {
    const [shows, setShows] = React.useState([])
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false)
    const [searchParams, setSearchParams] = useSearchParams()

    const genreFilter = searchParams.get("genres")

    React.useEffect(() => {
        async function fetchShows() {

            try {
                setLoading(true)
                const response = await fetch('https://podcast-api.netlify.app');
                if (!response.ok) {
                throw new Error('Data fetching Failed');
                }
                const data = await response.json();
                setShows(data)
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        }
    
        fetchShows();
    }, []);

    if (loading) {
        return <h1 aria-live="polite">Loading...</h1>
    }
    
    if (error) {
        return <h1 aria-live="assertive">There was an error: {error.message}</h1>
    }


    const displayedShows = genreFilter
    ? shows.filter(show => show.genres.includes(parseInt(genreFilter)))
    : shows;

    console.log(genreFilter)

    const showsElements = displayedShows.sort((a, b) => a.title.localeCompare(b.title)).map((show, index) => (
        <div key={show.id} className="show-tile">
            <Link
                to={show.id}
            >
                <img src={show.image} />
              
            </Link>
            <div className="show-info">   
                <h3>{index + 1} {show.title}</h3>
                {/* <p className="description">{show.description}</p> */}
                <p>{genreInfo(show.genres)}</p>
                
                <p>Seasons: {show.seasons}</p>
            </div>
        </div>
    
    ))
    const genreButtons = Object.keys(genresObject).map((key) => (
        <button key={key} 
            onClick={() => setSearchParams(`?genres=${key}`)}
            className={`${genreFilter === key ? "selected" : "" }`}
            >
          {genresObject[key]}
        </button>
    ));


    return (

        <>
            <div className="genre_buttons" >
                {genreButtons}
                {   genreFilter ? (
                    <button onClick={() => setSearchParams("")}>Clear</button>
                ) : null}
            </div>
            
            <div className="show-list">
                {showsElements}
            </div>
        </>
    )
}
