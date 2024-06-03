import React, {CSSProperties} from "react";
import type {GetServerSideProps} from "next";
import Image from "next/image";
import {Typography} from "@mui/material";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {styled} from "@mui/system";
import {GenericPageProps} from "../_app";
import {SimpleModal} from "../../components/modals/Modal";
import {fetchAlbums, type AlbumPhotos} from "../../libs/fetch";

// Controls the SSR limit of images to load for the album
const defaultImagesToDisplay = 12;

export interface VaultPageProps {
  page: GenericPageProps["page"] & {
    images: AlbumPhotos[];
  };
}

const Feed: React.FC<VaultPageProps> = ({page}) => {
  const {images, title, description} = page;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<AlbumPhotos>(images[0] || {});

  const theme = useTheme();
  const bpUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const bpUpLg = useMediaQuery(theme.breakpoints.up("lg"));

  // console.log({selectedImage, isModalOpen});

  const handleOpenModal = (index: number) => {
    // console.log({index});
    setSelectedImage(images[index]);
    setIsModalOpen(true);
  };

  return (
    // Note: html HEAD tags are set in Layout.tsx and passed down via props in the SSR below.
    <>
      <Typography variant="h1" fontSize={40} fontWeight={"medium"}>
        {title}
      </Typography>
      <Typography variant="body1">{description}</Typography>
      {/* {images.length > 0 && (
        <button onClick={() => setIsModalOpen(true)}>Test: Open Selected Image</button>
      )} */}
      <Box component="section" sx={{width: "100%", my: 4}}>
        {images.length === 0 && (
          <Typography variant="body1">No images to show</Typography>
        )}
        {images.length > 0 && (
          <ImageList cols={bpUpLg ? 3 : bpUpMd ? 2 : 1} rowHeight={200}>
            {images.map(({id, thumbnailUrl, title}, index) => (
              <ImageListItem key={id}>
                <button
                  type="button"
                  onClick={() => handleOpenModal(index)}
                  aria-label={`Open image: ${title}`}
                >
                  <StyledImage
                    src={thumbnailUrl}
                    alt={title}
                    loading="lazy"
                    objectFit="cover"
                    layout="fill"
                    cursor="zoom-in"
                  />
                </button>
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>
      {images.length > 0 && (
        <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {!!selectedImage && (
            <StyledImage
              src={selectedImage?.thumbnailUrl}
              // url has a high failure rate
              // src={selectedImage.url}
              alt={selectedImage?.title}
              loading="lazy"
              objectFit="contain"
              layout="fill"
              onClick={() => setIsModalOpen(false)}
              cursor="zoom-out"
            />
          )}
        </SimpleModal>
      )}
    </>
  );
};

export default Feed;

const StyledImage = styled(Image)(({cursor}: {cursor?: CSSProperties["cursor"]}) => ({
  cursor: cursor || "auto",
}));

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const albumId = Number(ctx.params?.id) || 1;

  return await Promise.all([fetchAlbums({limit: defaultImagesToDisplay, albumId})])
    .then(async (response) => {
      const [images] = response;
      return {
        props: {
          page: {
            head: {
              title: `Image Vault - Album ${albumId}`,
              description: `Image Vault page, showing images from the album ${albumId}.`,
              keywords: ["images", "vault"],
            },
            title: `Image Vault - Album ${albumId}`,
            description:
              "Image Vault Page: The images from jsonplaceholder load incredibly slowly (if at all). Therefore if you don't see any images, please refresh the page. Also note that I'm using the thumbnailUrl for the modal image, due the high failure rate of the full image. Further to this, I've added a `limit` to the fetchAlbums function to further reduce the load on the API.",
            images,
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
