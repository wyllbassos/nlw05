import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router';
import api from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { Episode as EpisodeProps } from '../'

type EpisodePageProps = {
    episode: EpisodeProps;
  }

export default function Episode({ episode }: EpisodePageProps) {
    const router = useRouter();
    return (
        <h1>{router.query.slug}</h1>
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

    const { data } = await api.get(`/episodes/${slug}`) as {data: EpisodeProps}
    
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