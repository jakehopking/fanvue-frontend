import {API_ENDPOINTS} from "../constants/api";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
export interface PostComment {
  postId: Post["id"];
  id: number;
  name: string;
  email: string;
  body: string;
}

export interface Album {
  userId: number;
  id: number;
  title: string;
}

export interface AlbumPhotos {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const fetchPosts = async ({
  limit,
}: {
  /**
   * The number of posts to fetch
   */
  limit?: number;
}): Promise<Post[] | []> => {
  try {
    const url = limit ? `${API_ENDPOINTS.POSTS}?_limit=${limit}` : API_ENDPOINTS.POSTS;
    const response = await fetch(url);
    const json = await response?.json();
    // console.log({json});
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchPostComments = async ({
  postId,
}: {
  postId: Post["id"];
}): Promise<PostComment[] | []> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.POSTS}/${postId}/comments`);
    const json = await response?.json();
    // console.log({json});
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchAlbums = async ({
  limit,
  albumId = 1,
}: {
  /**
   * The number of images to fetch for given album
   */
  limit?: number;
  albumId: number;
}): Promise<AlbumPhotos[] | []> => {
  try {
    const url = limit
      ? `${API_ENDPOINTS.ALBUMS}/${albumId}/photos?_limit=${limit}`
      : `${API_ENDPOINTS.ALBUMS}/${albumId}/photos`;
    const response = await fetch(url);
    const json = await response?.json();
    // console.log({json});
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};
