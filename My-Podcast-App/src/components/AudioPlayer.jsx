import React from 'react'
import "./CSS/AudioPlayer.css";
import { BsArrowLeftShort } from "react-icons/bs"
import { BsArrowRightShort } from "react-icons/bs"
import { FaPlay } from "react-icons/fa"
import { FaPause } from "react-icons/fa"

export default function AudioPlayer({
    audioSrc,
    selectedPodcast,
    audioRef, 
    episodeName, 
    currentPlayingEpisodeName, 
    currentPodcastImg,
    setCurrentPlayingEpisodeId,
}) {

    // state
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);

    // references
    const audioPlayer = React.useRef();   // reference our audio component
    const progressBar = React.useRef();   // reference our progress bar
    const animationRef = React.useRef();  // reference the animation

    React.useEffect(() => {
        if (audioRef.current) {
            const seconds = Math.floor(audioRef.current.duration);
            setDuration(seconds);
            progressBar.current.max = seconds;
        }
    }, [audioRef?.current?.loadedmetadata, audioRef?.current?.readyState]);

    const calculateTime = (secs) => {
        if (isNaN(secs) || secs === undefined) {
            return "00:00";
        }
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    const togglePlayPause = () => {
        const prevValue = isPlaying;
        setIsPlaying(!prevValue);
    
        if (!prevValue) {
            audioRef.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            audioRef.current.pause();
            cancelAnimationFrame(animationRef.current);
        }
    };

    const whilePlaying = () => {
        const currentValue = audioRef.current.currentTime;
    
        if (!isNaN(currentValue)) {
            progressBar.current.value = currentValue;
            changePlayerCurrentTime();
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    };

    const changeRange = () => {
        audioRef.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    };

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value);
    }

    const backThirty = () => {
        progressBar.current.value = Number(progressBar.current.value - 30);
        changeRange();
    }

    const forwardThirty = () => {
        progressBar.current.value = Number(progressBar.current.value + 30);
        changeRange();
    }

    return (

        <div className="audio-player">

            <audio 
                ref={audioRef} 
                src={audioSrc} 
                preload="auto" 
                type="audio/mp3">
            </audio>
            <button className="forward-backward" onClick={backThirty}><BsArrowLeftShort /> 30</button>
            <button onClick={togglePlayPause} className="play-pause">
                {isPlaying ? <FaPause /> : <FaPlay className="play" />}
            </button>
            <button className="forward-backward" onClick={forwardThirty}>30 <BsArrowRightShort /></button>

            {/* current time */}
            <div className="current-time">{calculateTime(currentTime)}</div>

            {/* progress bar */}
            <div>
                <input type="range" className="progress-bar" defaultValue="0" ref={progressBar} onChange={changeRange} />
            </div>

            {/* duration */}
            <div className="duration">
                {(duration && !isNaN(duration)) && calculateTime(duration)}
            </div>


            <div className='audio-player_div'>
                <img src={currentPodcastImg} alt="" className='audio-player_div'/>
                <div>
                <span className="audio-player-title">{selectedPodcast.title}</span>
                <span className="audio-player-episode">{episodeName}</span>
                </div>
            </div>
        </div>
    )
}
