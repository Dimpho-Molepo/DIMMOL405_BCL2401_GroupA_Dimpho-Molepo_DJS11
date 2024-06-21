import React from "react";
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";


export default function Favourites() {
    const [loading, setLoading] = React.useState(true);
    const [favorites, setFavorites] = React.useState([]);
    const [currentEpisode, setCurrentEpisode] = React.useState(null);

    // Fetch favorites from local storage when the component mounts
    React.useEffect(() => {
        const favouriteEpisodes = JSON.parse(localStorage.getItem("favouriteEpisodes")) || [];
        setFavorites(favouriteEpisodes);
        setLoading(false);
    }, []);

   

    const handleFavourite = (episode, episodeTitle) => {
        const storedFaves = JSON.parse(localStorage.getItem("favouriteEpisodes")) || [];
        const isAlreadyFavorite = storedFaves.some(
            (item) => item.showId === episode.showId && item.episodeTitle === episodeTitle
        );

        if (isAlreadyFavorite) {
            const confirmRemoval = window.confirm("Are you sure you want to remove this episode from your favorites?");
            if (confirmRemoval) {
                const updatedFaves = storedFaves.filter(
                    (item) => !(item.showId === episode.showId && item.episodeTitle === episodeTitle)
                );
                setFavorites(updatedFaves);
                localStorage.setItem("favouriteEpisodes", JSON.stringify(updatedFaves));
            }
        }
    };

    if (loading) {
        return <CircularProgress className="loader" />;
    }

    const favouriteEpisodesElements = favorites.map((favourite) => (
        <div key={favourite.episode} className="episode-tile">
            <div className="image-container">
                <img src={favourite.seasonImage} alt="" className="play-image" />
                {isPlaying && currentEpisode === favourite ? (
                    <FaPause 
                        className="play-button"
                        onClick={() => handlePlayPause(favourite)}
                    />
                ) : (
                    <FaPlay 
                        className="play-button"
                        onClick={() => handlePlayPause(favourite)}
                    />
                )}
            </div>
            <h4>
                <span>{favourite.episode}</span>. {favourite.episodeTitle}
            </h4>
            {favorites.some(fav => fav.episodeTitle === favourite.episodeTitle) ? (
                <MdFavorite
                    onClick={() => handleFavourite(favourite, favourite.episodeTitle)}
                    className="details--podcast-favourite like"
                />
            ) : (
                <MdOutlineFavoriteBorder
                    onClick={() => handleFavourite(favourite, favourite.episodeTitle)}
                    className="details--podcast-favourite unlike"
                />
            )}
            <p>{new Date(favourite.timeAdded).toLocaleString()}</p>
        </div>
    ));

    return (
        <div>
            <Link to="/" className="back-to-home">
                <FaArrowLeft /> Back
            </Link>
            <h1>Favorites List</h1>
            {favorites.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                <div className="elements">{favouriteEpisodesElements}</div>
            )}
        </div>
    );
}