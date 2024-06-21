import React, { useState, useRef } from "react";
import "./CSS/AudioPlayer.css";

export default function AudioPlayer({
  episodeName,
  currentPlayingEpisodeName,
  currentPodcastImg,
  audioSrc,
  onClose,
  show,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCloseClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    setShowConfirm(false);
    onClose();
  };

  if (!show) {
    return null;
  }

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  return (
    <div className={`audio-player`}>
      <button onClick={handleCloseClick} className="close-btn">
        &times;
      </button>
      <div className="player-info">
        <img
          src={currentPodcastImg}
          alt={`${currentPodcastImg} album cover`}
          className="album-cover"
        />
        <div className="song-details">
          <h3 className="song-title">{episodeName}</h3>
          <p className="song-artist">{currentPlayingEpisodeName}</p>
        </div>
      </div>

      <div className="player-controls">
        <button onClick={togglePlay} className="play-btn">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <audio
          ref={audioRef}
          src={audioSrc}
          type="audio/mp3"
          preload="auto"
          autoPlay
          controls
        />
        {showConfirm && (
          <div className="confirm-modal">
            <p>Are you sure you want to close the media player?</p>
            <div className="confirm-buttons">
              <button onClick={handleConfirmClose} className="confirm-btn">
                Yes
              </button>
              <button onClick={handleCancelClose} className="cancel-btn">
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
