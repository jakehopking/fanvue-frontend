import type {GetServerSideProps} from "next";
import {Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {FeedCard, PostWithComments} from "../components/feed-card/FeedCard";
import {GenericPageProps} from "./_app";
import {fetchPostComments, fetchPosts} from "../libs/fetch";

// Controls the SSR limit of posts to load
const defaultPostsToLoad = 12;

export interface FeedPageProps {
  page: GenericPageProps["page"] & {
    feed: PostWithComments[];
  };
}

const Feed: React.FC<FeedPageProps> = ({page}) => {
  const {feed, title, description} = page;

  // console.log({feed, title, description});

  // Note: html HEAD tags are set in Layout.tsx and passed down via props in the SSR below.

  return (
    <>
      <Typography variant="h1" fontSize={40} fontWeight={"medium"}>
        {title}
      </Typography>
      <Typography variant="body1">{description}</Typography>
      <Box component="section" sx={{width: "100%", my: 4}}>
        {feed.length === 0 && <Typography variant="body1">No posts to show</Typography>}
        {feed.length > 0 && (
          <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
            {feed.map((post) => (
              <Grid item xs={12} md={6} key={post.id}>
                <FeedCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Feed;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await Promise.all([fetchPosts({limit: defaultPostsToLoad})])
    .then(async (response) => {
      const [feed] = response;

      const feedWithComments = await Promise.all(
        feed.map(async (post) => {
          const comments = await fetchPostComments({postId: post.id});
          return {
            ...post,
            comments,
          };
        })
      );

      // console.log({feedWithComments});

      return {
        props: {
          page: {
            head: {
              title: "Feed",
              description: "Feed page",
              keywords: ["Feed", "Posts", "Blog Posts", "With Comments"],
            },
            title: "Feed",
            description: "Feed page",
            feed: feedWithComments,
          },
        },
      };
    })
    .catch((error) => {
      return {
        notFound: true,
      };
    });
};
