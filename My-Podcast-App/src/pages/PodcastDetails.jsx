import React from "react";
import { useParams } from "react-router-dom";
import "./CSS/PodcastDetails.css";
import { FaPlay } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaPause } from "react-icons/fa";



export default function PodcastDetails() {
  const [loading, setLoading] = React.useState(false);
  const [selectedShow, setSelectedShow] = React.useState({});
  const [error, setError] = React.useState(null);
  const [currentEpisode, setCurrentEpisode] = React.useState({});
  const [isPlaying, setIsPlaying] = React.useState(false); // Add this state variable
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
    return <h1 aria-live="polite">Loading...</h1>;
  }

  if (error) {
    return <h1 aria-live="assertive">There was an error: {error.message}</h1>;
  }

  if (!selectedShow.seasons) {
    return <h1>No seasons found</h1>;
  }

  const showElements = selectedShow.seasons.map((season) => (
    <div key={season.season} className="season-tile">
      <img src={season.image} />
      <div className="season-info">
        <h2>{season.title}</h2>
        {season.episodes.map((episode) => (
          <div key={episode.episode} className="episode-tile">
            <div className="image-container">
              <img src={season.image} alt="" className="play-image" />
              <button
                className="play-button"
                onClick={() => {
                  setCurrentEpisode(episode);
                  setIsPlaying(true); 
                }}
              >
                {isPlaying && currentEpisode.episode === episode.episode? (
                  <FaPause />
                ) : (
                  <FaPlay />
                )}
              </button>
            </div>

            <h4>
              <span>{episode.episode}</span>. {episode.title}
            </h4>
            {/* <p>{episode.description}</p> */}

            <button className="like-button">
              <MdFavorite />
            </button>
          </div>
        ))}
      </div>
    </div>
  ));

  return (
    <>
      <div key={selectedShow.id} className="selected-show">
        <img src={selectedShow.image} alt="" />
        <div className="selected-show_info">
          <h1>{selectedShow.title}</h1>
          <p>{selectedShow.description}</p>
          <p>{new Date(selectedShow.updated).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="elements">{showElements}</div>

    </>
  );
}