import React from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { FaArrowLeft } from "react-icons/fa";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import SortButtons from "../utils/SortButtons";
import Search from "../components/Search";

export default function Favourites() {
  const [loading, setLoading] = React.useState(true);
  const [favorites, setFavorites] = React.useState([]);
  const [sortedShows, setSortedShows] = React.useState([]);
  const [sortType, setSortType] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const favouriteEpisodes =
      JSON.parse(localStorage.getItem("favouriteEpisodes")) || [];
    setFavorites(favouriteEpisodes);
    setSortedShows(favouriteEpisodes); 
    setLoading(false);
  }, []);

  const handleFavourite = (episode, episodeTitle) => {
    const storedFaves =
      JSON.parse(localStorage.getItem("favouriteEpisodes")) || [];
    const isAlreadyFavorite = storedFaves.some(
      (item) =>
        item.showId === episode.showId && item.episodeTitle === episodeTitle
    );

    if (isAlreadyFavorite) {
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this episode from your favorites?"
      );
      if (confirmRemoval) {
        const updatedFaves = storedFaves.filter(
          (item) =>
            !(
              item.showId === episode.showId &&
              item.episodeTitle === episodeTitle
            )
        );
        setFavorites(updatedFaves);
        setSortedShows(updatedFaves);
        localStorage.setItem("favouriteEpisodes", JSON.stringify(updatedFaves));
      }
    }
  };

  const sortShowsBy = (sortType) => {
    setSortType(sortType);
    const sorted = [...favorites];
    const comparator = (a, b) => {
      switch (sortType) {
        case "A-Z":
          return a.episodeTitle.localeCompare(b.episodeTitle);
        case "Z-A":
          return b.episodeTitle.localeCompare(a.episodeTitle);
        case "Newest":
          return new Date(b.timeAdded) - new Date(a.timeAdded);
        case "Oldest":
          return new Date(a.timeAdded) - new Date(b.timeAdded);
        default:
          return 0;
      }
    };
    sorted.sort(comparator);
    setSortedShows(sorted);
  };

  const clearSort = () => {
    setSortedShows(favorites);
    setSortType("");
  };

  if (loading) {
    return <CircularProgress className="loader" />;
  }
  const filteredShows = sortedShows.filter((show) =>
    show.episodeTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favouriteEpisodesElements = filteredShows.map((favourite, index) => (
    <div
      key={`${favourite.showId}-${favourite.episodeTitle}`}
      className="episode-tile"
    >
      <div className="image-container">
        <img src={favourite.seasonImage} alt="" className="play-image" />
      </div>
      <h4>
        <span>{index + 1}</span>. {favourite.episodeTitle}
      </h4>
      {favorites.some((fav) => fav.episodeTitle === favourite.episodeTitle) ? (
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

  const ClearLocalStorage = () => {
    localStorage.clear();
    setFavorites([]);
    setSortedShows([]);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div>
      <Link to="/" className="back-to-home">
        <FaArrowLeft /> Back
      </Link>
      <h1>Favorites List</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <>
          <div className="filter_sort">
            <Search onSearch={handleSearch} />
            <SortButtons
              sortShows={sortType}
              onSortChange={sortShowsBy}
              onClear={clearSort}
            />
          </div>

          <div className="elements">{favouriteEpisodesElements}</div>
          <button onClick={ClearLocalStorage} className="clear-button">
            Rest Favourites
          </button>
        </>
      )}
    </div>
  );
}
