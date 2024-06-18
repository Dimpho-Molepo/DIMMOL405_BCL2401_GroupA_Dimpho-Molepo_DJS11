import React from "react";
import { useParams } from "react-router-dom";
import "./CSS/PodcastDetails.css";
import { FaPlay } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaPause } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import AudioPlayer from "../components/AudioPlayer";

export default function PodcastDetails() {
    const [loading, setLoading] = React.useState(false);
    const [selectedShow, setSelectedShow] = React.useState({});
    const [error, setError] = React.useState(null);
    const [currentEpisode, setCurrentEpisode] = React.useState({});
    const [isPlaying, setIsPlaying] = React.useState(false); // Add this state variable
    const [currentPodcastImg, setCurrentPodcastImg] = React.useState('');
    const [currentEpisodeName, setCurrentEpisodeName] = React.useState('');
    const [episodeFaves, setEpisodeFaves] = React.useState([])
    const audioRef = React.useRef(null)

    const params = useParams();

    React.useEffect(() => {
        async function fetchSelectedShow() {
        try {
            setLoading(true);
            const response = await fetch(`https://podcast-api.netlify.app/id/${params.id}`);
            if (!response.ok) {
            throw new Error("Data fetching Failed");
            }
            const data = await response.json();
            setSelectedShow(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
        }

        fetchSelectedShow();
    }, [params.id]);

    if (loading) {
        return <CircularProgress className="loader"/>
    }

    if (error) {
        return <h1 aria-live="assertive">There was an error: {error.message}</h1>;
    }

    if (!selectedShow.seasons) {
        return <h1>No seasons found</h1>;
    }

    const handleFavourite = (episode, episodeTitle) => {
        const isAlreadyFavorite = episodeFaves.some(
            (item) => item.showId === params.id && item.episodeTitle === episodeTitle
        );
    
        if (isAlreadyFavorite) {
            setEpisodeFaves((prevFaves) =>
                prevFaves.filter(
                    (item) => !(item.showId === params.id && item.episodeTitle === episodeTitle)
                )
            );
        } else {
            setEpisodeFaves((prevFaves) => [
                ...prevFaves,
                {
                    showName: selectedShow.title,
                    episodeTitle: episodeTitle,
                    showId: params.id,
                    userId: episode.episode
                },
            ]);
        }
    
        localStorage.setItem("favouriteEpisodes", JSON.stringify(episodeFaves));
    };
    

    const handlePlayPause = (episode, season) => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
        setCurrentEpisode(episode);
        setCurrentPodcastImg(season.image); // Set the current podcast image
        setCurrentEpisodeName(episode.title); // Set the current episode name
    };
    

    const showElements = selectedShow.seasons.map((season) => (
        <div key={season.season} className="season-tile">
        {/* <img src={season.image} className="season-tile-image"/> */}
        <div className="season-info">
            <h2>{season.title}</h2>
            {season.episodes.map((episode) => (
            <div key={episode.episode} className="episode-tile">

                <div className="image-container">
                    <img src={season.image} alt="" className="play-image" />

                    {isPlaying && currentEpisode.episode === episode.episode ? (
                        <FaPause 
                        className="play-button"
                        onClick={() => handlePlayPause(episode, season)}
                        />
                    ) : (
                        <FaPlay 
                        className="play-button"
                        onClick={() => handlePlayPause(episode, season)}
                        />
                    )}

                </div>

                <h4>
                <span>{episode.episode}</span>. {episode.title}
                </h4>
                {/* <p>{episode.description}</p> */}

                    
                {episodeFaves.some(fav => fav.episodeTitle === episode.title) ? (
                        <MdFavorite
                            onClick={() => handleFavourite(episode, episode.title)}
                            className="details--podcast-favourite like"
                        />
                    ) : (
                        <MdOutlineFavoriteBorder
                            onClick={() => handleFavourite(episode, episode.title)}
                            className="details--podcast-favourite unlike"
                        />
                    )}
                  
            </div>
            ))}
        </div>
        </div>
    ));

    return (
        <>
        <div key={selectedShow.id} className="selected-show">
            <img src={selectedShow.image} alt="" className="selected-show-image"/>
            
            <div className="selected-show_info">
                <h1>{selectedShow.title}</h1>
                <p>{selectedShow.description}</p>
                <p>{new Date(selectedShow.updated).toLocaleDateString()}</p>
            </div>
        </div>
        <div className="elements">{showElements}</div>

        
            <AudioPlayer
                audioSrc={currentEpisode.file}
                selectedPodcast={selectedShow.title}
                episodeName={currentEpisodeName}
                currentPlayingEpisodeName={currentEpisodeName}
                currentPodcastImg={currentPodcastImg}
                setCurrentPlayingEpisodeId={setCurrentEpisode}
                audioRef={audioRef} 
            />
       
        </>
    );
}