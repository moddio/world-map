import { useEffect, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

import { fetcher } from './helpers';
import { siteUrl } from '../config';

const getIsError = (error, result) => {
  if (error) {
    return true;
  }

  if (result?.status === 'error') {
    return true;
  }

  return false;
};

export function useUser() {
  const {
    data: result,
    error,
    isLoading,
  } = useSWR(`${siteUrl}/api/v1/user/`, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  console.log(31, result)

  useEffect(() => {
    if (!isLoading && result && result.data) {
      localStorage.setItem('userData', JSON.stringify(result.data));

    //   if (typeof window?.Rollbar !== 'undefined') {
    //     window.Rollbar.configure({
    //       payload: {
    //         person: {
    //           id: result.data?._id,
    //           name: result.data?.local?.username,
    //         },
    //       },
    //     });
    //   }
    }
    if (!isLoading && !result?.data) {
      localStorage.removeItem('userData');

    //   if (typeof window?.Rollbar !== 'undefined') {
    //     window.Rollbar.configure({
    //       payload: {
    //         person: null,
    //       },
    //     });
    //   }
    }
  }, [result, isLoading]);

  return {
    user: result?.data,
    isLoading,
    isError: getIsError(error, result),
  };
}

export function useUserByName(username) {
  const {
    data: result,
    error,
    isLoading,
  } = useSWRImmutable(
    username ? `/api/v1/user-by-name/${username}/` : null,
    fetcher
  );

  return {
    user: result?.data,
    isLoading,
    isError: getIsError(error, result),
  };
}

export function useGames(category, searchTerm, options) {
  let key = `${siteUrl}/api/v1/games/`;

  if (category) {
    key += `?category=${category}`;
  } else if (searchTerm) {
    key += `?searchTerm=${searchTerm}`;
  }

  const { data, error, isLoading } = useSWR(key, fetcher, options);

  return {
    games: data,
    isLoading,
    isError: error,
  };
}

export function useGamesImmutable(category, searchTerm, options, opensource) {
  let key = `${siteUrl}/api/v1/games/`;

  if (category) {
    key += `?category=${category}`;
  } else if (searchTerm !== undefined) {
    key += `?searchTerm=${searchTerm}&opensource=${opensource}`;
  }

  const { data, error, isLoading } = useSWRImmutable(key, fetcher, options);

  return {
    games: data,
    isLoading,
    isError: error,
  };
}

export function useCreations() {
  const { data, error, isLoading } = useSWR('/api/v1/creations/', fetcher, {
    suspense: true,
  });

  return {
    creations: data,
    isLoading,
    isError: error,
  };
}

export async function getReleaseImmutable(gameId, releaseVersion, options) {
  let key = `${siteUrl}/api/game-client/cached/${gameId}/${releaseVersion}/`;
  return await axios.get(key).then((res) => res.data);
}

export async function getCreatorDataImmutable(gameId, options) {
  let key = `${siteUrl}/api/game/${gameId}/game-data-for-creators/`;
  return await axios.get(key).then((res) => res.data);
}

export async function getPlayDataImmutable(
  gameId,
  gameSlug,
  lobbyCode,
  firstFetch = false,
  publish = false
) {
  let key = `${siteUrl}/api/v1/game-server/${gameId}/?gameSlug=${gameSlug}&lobbyCode=${
    lobbyCode || ''
  }&firstFetch=${firstFetch}&publish=${publish}`;
  return await axios.get(key).then((res) => res.data);
}
