import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetch('https://playground.4geeks.com/apis/fake/sound/songs')
      .then(response => response.json())
      .then(data => setSongs(data))
      .catch(error => console.error('Error al obtener las canciones', error));
  }, []);

  const handleSongClick = (url) => {
    setCurrentSong(url);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.src = `https://playground.4geeks.com/apis/fake/sound/${url}`;
      audioRef.current.play();
    }
  }

  const findSongIndex = (url) => {
    return songs.findIndex(song => song.url === url);
  }

  const playPreviousSong = () => {
    const currentIndex = findSongIndex(currentSong);
    let previousIndex = currentIndex - 1;

    // Si se está en la primera canción, ir a la última
    if (previousIndex < 0) {
      previousIndex = songs.length - 1;
    }

    handleSongClick(songs[previousIndex].url);
  }

  const playNextSong = () => {
    const currentIndex = findSongIndex(currentSong);
    let nextIndex = currentIndex + 1;

    if (nextIndex >= songs.length) {
      nextIndex = 0;
    }

    handleSongClick(songs[nextIndex].url);
  }

  const togglePlayPause = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <div id='containerMusic'>
        <ul>
          {songs.map(song => (
            <li key={song.id} onClick={() => handleSongClick(song.url)} className={`song ${currentSong === song.url ? 'selectedSong' : ''}`}>
              <span className='numberSong'>{song.id}</span> {song.name}<br />
            </li>
          ))}
        </ul>
      </div>
      <div id="audioPlayer">
        <i onClick={playPreviousSong} className="fa-solid fa-square-caret-left fa-2xl"></i>
        <i onClick={togglePlayPause} className={isPlaying ? "fa-solid fa-circle-pause fa-2xl" : "fa-solid fa-play fa-2xl"}></i>
        <i onClick={playNextSong} className="fa-solid fa-square-caret-right fa-2xl"></i>
      </div>
      {currentSong && (
        <audio ref={audioRef} autoPlay>
          <source src={`https://playground.4geeks.com/apis/fake/sound/${currentSong}`} type="audio/mp3" />
          Tu navegador no soporta la reproducción de audio.
        </audio>
      )}
    </>
  )
}

export default App