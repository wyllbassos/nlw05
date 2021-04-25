import is from 'date-fns/esm/locale/is/index.js';
import { createContext, ReactNode, useContext, useState } from 'react'

import { Episode } from '../pages';

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffe: () => void;
  setPlayState: (state: boolean) => void;
  playList: (list: Episode[], index: number, isPlay?: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  stop: () => void;
  isShuffling: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPrevious = currentEpisodeIndex - 1 >= 0;
  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;

  function stop() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(false);
    setIsShuffling(false);
    setIsLooping(false);
  }

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number, isPlay = true) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(isPlay);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffe() {
    setIsShuffling(!isShuffling);
  }

  function setPlayState(state: boolean) {
    setIsPlaying(state);
  }

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }

  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setPlayState,
      playList,
      playNext,
      playPrevious,
      hasPrevious,
      hasNext,
      stop,
      isLooping,
      toggleLoop,
      toggleShuffe,
      isShuffling,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}