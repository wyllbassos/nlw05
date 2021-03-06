import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import api from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { Episode as EpisodeProps } from '../'
import Image from 'next/image';
import Link from 'next/link';

import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';

type EpisodePageProps = {
  episode: EpisodeProps;
}

export default function Episode({ episode }: EpisodePageProps) {
  const { play, stop } = usePlayer();

  const router = useRouter();
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button" onClick={stop}>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.published_at}</span>
        <span>{episode.durationAsString}</span>

        <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
          
      </header>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;

  const { data } = await api.get(`/episodes/${slug}`) as { data: EpisodeProps }

  const episode: EpisodeProps = {
    ...data,
    published_at: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    file: {
      ...data.file,
      duration: Number(data.file.duration),
    }
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}