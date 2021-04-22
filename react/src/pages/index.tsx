import { GetStaticProps } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type File = {
  url: string;
  type: string;
  duration: number;
}

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  durationAsString: string;
  file: File;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => (
            <li key={episode.id}>
              <Image width={192} height={192} src={episode.thumbnail} alt={episode.title}/>
              
              <div className={styles.episodeDetails}>
                <a href="">{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.published_at}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src="play-green.svg" alt="Tocar Episodio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}></section>
    </div>
  )
}

// export async function getServerSideProps() {
  export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    }
  });

  const episodes: Episode[] = data.map((episode: Episode) => {
    return {
      ...episode,
      published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      file: {
        ...episode.file,
        duration: Number(episode.file.duration),
      }
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

// missão espacial
//Em Busca do Proximo Nivel