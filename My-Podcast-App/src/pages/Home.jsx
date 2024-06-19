import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./CSS/Home.css"
import { genreInfo, genresObject } from "../Genre";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';


export default function Home() {
    const [shows, setShows] = React.useState([])
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [genreSelection, setGenreSelection] = React.useState('');
    const [sortShows, setSortShows] = React.useState("A-Z");
    const [sortedShows, setSortedShows] = React.useState([]);

    const genreFilter = searchParams.get("genres")

    React.useEffect(() => {
        async function fetchShows() {

            try {
                setLoading(true);
                const response = await fetch("https://podcast-api.netlify.app/shows");
                if (!response.ok) {
                  throw new Error("Data fetching Failed");
                }
                const data = await response.json();
                setShows(data);
                setSortedShows(data);
              } catch (error) {
                setError(error.message);
              } finally {
                setLoading(false);
              }
        }
    
        fetchShows();
    }, []);

    if (loading) {
        return <CircularProgress className="loader"/>
    }
    
    if (error) {
        return <h1 aria-live="assertive">There was an error: {error.message}</h1>
    }


    const genreChange = (event) => {
        const selectedGenre = event.target.value;
        setGenreSelection(selectedGenre);

        if (selectedGenre === "All Genres") {
            // If "All Genres" is selected, remove the genre filter
            setSearchParams({});
            setSortedShows(shows);
        } else {
            // Apply the genre filter
            setSearchParams({ genres: selectedGenre });
            const filteredShows = shows.filter(show =>
                show.genres.includes(parseInt(selectedGenre))
            );
            setSortedShows(filteredShows);
        }
    }

    const sortShowsBy = (sortType) => {
        const sorted = [...shows];
        const comparator = (a, b) => {
            switch (sortType) {
                case "A-Z":
                    return a.title.localeCompare(b.title);
                case "Z-A":
                    return b.title.localeCompare(a.title);
                case "Newest":
                    return new Date(b.updated) - new Date(a.updated);
                case "Oldest":
                    return new Date(a.updated) - new Date(b.updated);
                default:
                    return 0;
            }
        };
        sorted.sort(comparator);
        setSortedShows(sorted);
        setSortShows(sortType);
    };

    // const displayedShows = genreFilter
    // ? shows.filter(show => show.genres.includes(parseInt(genreFilter)))
    // : shows;

    // const showsToDisplay = sortShows ? sortedShows : displayedShows;

    const showsElements = sortedShows.map((show, index) => (
        <div key={show.id}  className="show-tile">
            <div className="show-tile-item">
                <Link
                    to={`/show/${show.id}`}
                    
                >
                    <img src={show.image} />
                
                </Link>
                <div className="show-info">   
                    <h3 className="show-name">{index + 1}. {show.title}</h3>
                    {/* <p className="description">{show.description}</p> */}
                    <p className="show-genre">{genreInfo(show.genres)}</p>
                    
                    <p className="show-seasons">Seasons: {show.seasons}</p>
                    <p className="show-seasons">Updated: {new Date(show.updated).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    
    ))
    
    const genreButtons = Object.keys(genresObject).map((key) => (
        <MenuItem key={key} 
            onClick={() => setSearchParams(`?genres=${key}`)}
            className={`${genreFilter === key ? "selected" : "btn" }`}
            value={key}
            >
          {genresObject[key]}
        </MenuItem>
    ));


    return (

        <>
            <div className="filter_sort" >
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="genre-select-label">Genre</InputLabel>
                        <Select
                            labelId="genre-select-label"
                            id="genre-select"
                            value={genreSelection}
                            label="Genre"
                            onChange={genreChange}
                        >
                            <MenuItem 
                                onClick={() => {
                                // setSearchParams("")
                                setGenreSelection("")
                                }} value="All Genres"
                            >All Genres</MenuItem>
                            {genreButtons}
                            
                        </Select>
                    </FormControl>
                </Box>
                
                {/* { genreFilter } */}

                <div className="sort-shows-div">

                    <button className="sort-button" onClick={() => sortShowsBy("A-Z")}>A-Z</button>
                    <button className="sort-button" onClick={() => sortShowsBy("Z-A")}>Z-A</button>
                    <button className="sort-button" onClick={() => sortShowsBy("Newest")}>Newest</button>
                    <button className="sort-button" onClick={() => sortShowsBy("Oldest")}>Oldest</button>

                    {sortShows && (
                        <button
                            onClick={() => {
                                setSortShows("");
                                setSortedShows(shows);
                            }}
                            className="clear-button"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
            
            <div className="show-list">
                {showsElements}
            </div>
        </>
    )
}
