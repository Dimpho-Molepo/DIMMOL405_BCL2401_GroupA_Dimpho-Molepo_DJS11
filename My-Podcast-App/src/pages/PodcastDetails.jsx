import React from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./CSS/PodcastDetails.css";
import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import AudioPlayer from "../components/AudioPlayer";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function PodcastDetails() {
  const [loading, setLoading] = React.useState(false);
  const [selectedShow, setSelectedShow] = React.useState({});
  const [error, setError] = React.useState(null);
  const [currentEpisode, setCurrentEpisode] = React.useState({});
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPodcastImg, setCurrentPodcastImg] = React.useState("");
  const [currentEpisodeName, setCurrentEpisodeName] = React.useState("");
  const [episodeFaves, setEpisodeFaves] = React.useState([]);
  const [selectedSeason, setSelectedSeason] = React.useState("");
  const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);

  const params = useParams();

  React.useEffect(() => {
    async function fetchSelectedShow() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://podcast-api.netlify.app/id/${params.id}`
        );
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

  React.useEffect(() => {
    const storedFaves =
      JSON.parse(localStorage.getItem("favouriteEpisodes")) || [];
    if (storedFaves) {
      setEpisodeFaves(storedFaves);
    }
  }, []);

  if (loading) {
    return <CircularProgress className="loader" />;
  }

  if (error) {
    return <h1 aria-live="assertive">There was an error: {error.message}</h1>;
  }

  if (!selectedShow.seasons) {
    return <h1>No seasons found</h1>;
  }

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleFavourite = (episode, episodeTitle) => {
    const storedFaves =
      JSON.parse(localStorage.getItem("favouriteEpisodes")) || [];
    const isAlreadyFavorite = storedFaves.some(
      (item) => item.showId === params.id && item.episodeTitle === episodeTitle
    );

    if (isAlreadyFavorite) {
      const updatedFaves = storedFaves.filter(
        (item) =>
          !(item.showId === params.id && item.episodeTitle === episodeTitle)
      );
      setEpisodeFaves(updatedFaves);
      localStorage.setItem("favouriteEpisodes", JSON.stringify(updatedFaves));
    } else {
      const newFave = {
        showName: selectedShow.title,
        episodeTitle: episodeTitle,
        showId: params.id,
        userId: episode.episode,
        seasonImage: selectedSeasonData.image,
        timeAdded: new Date().toLocaleString(),
      };
      const updatedFaves = [...storedFaves, newFave];
      setEpisodeFaves(updatedFaves);
      localStorage.setItem("favouriteEpisodes", JSON.stringify(updatedFaves));
    }
  };

  const handlePlayPause = (episode, season) => {
    setShowAudioPlayer(true);

    if (isPlaying && currentEpisode.episode === episode.episode) {
      setIsPlaying(false);
    } else {
      if (currentEpisode.episode !== episode.episode) {
        setCurrentEpisode(episode);
        setCurrentPodcastImg(season.image);
        setCurrentEpisodeName(episode.title);
      }
      setIsPlaying(true);
    }

    setCurrentEpisode(episode);
    setCurrentPodcastImg(season.image);
    setCurrentEpisodeName(episode.title);
  };

  const selectedSeasonData = selectedShow.seasons.find(
    (season) => season.season.toString() === selectedSeason
  );

  const episodeElements = selectedSeasonData
    ? selectedSeasonData.episodes.map((episode) => (
        <div key={episode.episode} className="episode-tile">
          <div className="image-container">
            <img src={selectedSeasonData.image} alt="" className="play-image" />

            {isPlaying && currentEpisode.episode === episode.episode ? (
              <FaPause
                className="play-button"
                onClick={() => handlePlayPause(episode, selectedSeasonData)}
              />
            ) : (
              <FaPlay
                className="play-button"
                onClick={() => handlePlayPause(episode, selectedSeasonData)}
              />
            )}
          </div>

          <h4>
            <span>{episode.episode}</span>. {episode.title}
          </h4>
          {episodeFaves.some((fav) => fav.episodeTitle === episode.title) ? (
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
      ))
    : null;

  return (
    <>
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back
      </Link>

      <div key={selectedShow.id} className="selected-show">
        <div className="selected-show-image">
          <img
            src={selectedShow.image}
            alt={selectedShow.title}
            className="selected-show-image"
          />
        </div>
        <div className="selected-show_info">
          <h1>{selectedShow.title}</h1>
          <p className="description">{selectedShow.description}</p>
          <p className="date">
            {new Date(selectedShow.updated).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Box sx={{ minWidth: 120, marginTop: 2 }} className="drop-down">
        <FormControl fullWidth>
          <InputLabel id="season-select-label">Season</InputLabel>
          <Select
            labelId="season-select-label"
            id="season-select"
            value={selectedSeason}
            label="Season"
            onChange={handleSeasonChange}
          >
            {selectedShow.seasons.map((season) => (
              <MenuItem
                className="menu-item"
                key={season.season}
                value={season.season.toString()}
              >
                {season.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedSeason && (
        <>
          <h2 className="number-of-episodes">
            Episodes: {episodeElements.length}
          </h2>
          <div className="elements">{episodeElements}</div>
        </>
      )}

      <AudioPlayer
        audioSrc={currentEpisode.file}
        selectedPodcast={selectedShow}
        episodeName={selectedShow.title}
        currentPlayingEpisodeName={currentEpisodeName}
        currentPodcastImg={currentPodcastImg}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onClose={() => setShowAudioPlayer(false)}
        show={showAudioPlayer}
      />
    </>
  );
}
