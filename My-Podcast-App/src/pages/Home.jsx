import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"
import { genreInfo, genres } from "../Genre";


export default function Home() {
    const [episodes, setEpisodes] = React.useState([])
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        async function fetchEpisodess() {

            try {
                setLoading(true)
                const response = await fetch('https://podcast-api.netlify.app');
                if (!response.ok) {
                throw new Error('Data fetching Failed');
                }
                const data = await response.json();
                setEpisodes(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        }
    
        fetchEpisodess();
    }, []);

    if (loading) {
        return <h1 aria-live="polite">Loading...</h1>
    }
    
    if (error) {
        return <h1 aria-live="assertive">There was an error: {error.message}</h1>
    }



    console.log(episodes.genres)

    const episodesElements = episodes.sort((a, b) => a.title.localeCompare(b.title)).map(episode => (
        <div key={episode.id} className="episode-tile">
            <Link
                to={episode.id}
            >
                <img src={episode.image} />
              
            </Link>
            <div className="episode-info">   
                <h3>{episode.title}</h3>
                <p className="description">{episode.description}</p>
                <p>{genreInfo(episode.genres)}</p>
                
                <p>Seasons: {episode.seasons}</p>
            </div>
        </div>
    
    ))
    const genreButtons = Object.keys(genres).map((key) => (
        <button>{genres[key]}</button>
    ));


    return (

        <>
            <div className="genreButton">
                {genreButtons}
            </div>
            
            <div className="episode-list">
                {episodesElements}
            </div>
        </>
    )
}
