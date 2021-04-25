import { createContext } from 'react'
import { Episode } from '../pages';

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);
