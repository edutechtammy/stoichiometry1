import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioFiles, autoplay = false, onTimeUpdate }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    // Use first audio file if multiple provided
    const audioFile = audioFiles && audioFiles.length > 0 ? audioFiles[0] : null;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            const time = audio.currentTime;
            setCurrentTime(time);
            if (onTimeUpdate) {
                onTimeUpdate(time);
            }
        };
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [onTimeUpdate]);

    useEffect(() => {
        if (autoplay && audioRef.current && audioFile) {
            audioRef.current.play().catch(err => {
                console.log('Autoplay prevented:', err);
            });
            setIsPlaying(true);
        }
    }, [autoplay, audioFile]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * duration;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!audioFile) return null;

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={`/assets/${audioFile.path}`}
                preload="metadata"
            />

            <div className="audio-controls">
                <button
                    className="play-button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                <div className="time-display">
                    {formatTime(currentTime)}
                </div>

                <div
                    className="progress-bar"
                    onClick={handleSeek}
                >
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="time-display">
                    {formatTime(duration)}
                </div>

                <button
                    className="volume-button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted || volume === 0 ? (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                        </svg>
                    ) : volume > 0.5 ? (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7 9v6h4l5 5V4l-5 5H7z" />
                        </svg>
                    )}
                </button>

                <input
                    type="range"
                    className="volume-slider"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;
