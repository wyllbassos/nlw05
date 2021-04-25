import Image from 'next/image';
import Head from 'next/head';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../../utils/convertDurationToTimeString';

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    currentEpisodeIndex,
    episodeList,
    isPlaying,
    togglePlay,
    setPlayState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    toggleLoop,
    isLooping,
    toggleShuffe,
    isShuffling,
  } = useContext(PlayerContext);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef && audioRef.current && audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount)
  }

  function handleEnded() {
    if (hasNext) {
      playNext();
    } else {
      stop();
    }

  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <Head>
        <title>Podcastrs | {episode ? `${convertDurationToTimeString(progress)} - ${episode.title}` : 'Stop'}</title>
      </Head>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode && (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      )}

      {!episode && (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}


      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode && (
              <Slider
                max={episode.file.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            )}
            {!episode && <div className={styles.emptySlider} />}
          </div>
          <span>{episode ? episode.durationAsString : '00:00:00'}</span>
        </div>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.file.url}
            onPlay={() => setPlayState(true)}
            autoPlay={isPlaying}
            loop={isLooping}
            onEnded={handleEnded}
            onLoadedMetadata={setupProgressListener}
            onPause={() => setPlayState(false)}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffe} className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type="button" disabled={!episode || !hasPrevious} >
            <img src="/play-previous.svg" alt="Tocar anterior" onClick={playPrevious} />
          </button>

          <button
            type="button"
            disabled={!episode}
            className={styles.playButton}
            onClick={() => togglePlay()
            }>
            {isPlaying
              ? <img src={'/pause.svg'} alt="Tocar" />
              : <img src={'/play.svg'} alt="Tocar" />
            }

          </button>

          <button type="button" disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" onClick={playNext} />
          </button>

          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>

      </footer>
    </div>
  )
}