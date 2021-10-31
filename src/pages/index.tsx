import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  id: string;
  title: string;
  description: string;
  ts: number;
  url: string;
};

type ImageResponse = {
  data: Image[];
  after: string;
};

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }): Promise<ImageResponse> => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(image => {
      return image.data.flat();
    });
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            loadingText="Carregando..."
            isLoading={isFetchingNextPage}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
