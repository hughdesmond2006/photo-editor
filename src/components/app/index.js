import React, { useState, useCallback, useEffect } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import PhotoDetails from "../photoDetails";
import "./App.css";
import InfiniteScroll from "react-infinite-scroller";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  // load first api page of photos on mount
  useEffect(() => {
    loadItems(1);
  }, []);

  // this is called by the Gallery when the Lightbox is opened
  // setting viewerIsOpen to true activates single photo view via conditional rendering
  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  // functionality for the 'X' button
  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  //<button
  // onClick={() => setBlur(blur === MAX_BLUR ? 0 : blur + 1)}
  // >
  //   blur+
  // </button>
  // <button onClick={() => setIsGreyscale(!isGreyscale)}>
  //   greyscale+
  // </button>

  // this is called when the scroller hits the bottom
  // each time with a new api page number
  // const loadItems = page => {
  //   let API_KEY = "6473511-0417f2cad683f1bee54cafe15";
  //   let URL = `https://pixabay.com/api/?key=${API_KEY}&q=travel&image_type=photo&pretty=true&page=${page}`;

  //   fetch(URL)
  //     .then(res => res.json())
  //     .then(
  //       result => {
  //         // only fetch HD quality photos when screen size is large enough
  //         const HD = window.innerWidth > HD_IMAGE_THRESHOLD;

  //         // owidth means original width, for display in Photo Details
  //         // width/height fields are modified by the Gallery
  //         let photoArr = result.hits.map(x => ({
  //           id: x.id,
  //           src: HD ? x.fullHDURL : x.webformatURL,
  //           width: x.imageWidth,
  //           height: x.imageHeight,
  //           owidth: x.imageWidth,
  //           oheight: x.imageHeight,
  //           tags: x.tags,
  //           views: x.views,
  //           downloads: x.downloads,
  //           user: x.user
  //         }));

  //         // if no more data (reached the last page)
  //         if (photoArr.length === 0) {
  //           setHasMoreData(false);
  //         } else {
  //           setPhotos([...photos, ...photoArr]);
  //         }
  //       },
  //       error => {
  //         setFetchError(error);
  //       }
  //     );
  // };

  const loadItems = (page) => {
    let URL = `https://picsum.photos/v2/list?page=${page}`;

    fetch(URL)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);

          // owidth means original width, for display in Photo Details
          // width/height fields are modified by the Gallery
          let photoArr = result.map((x) => ({
            id: x.id,
            src: x.download_url,
            width: x.width,
            height: x.height,
            owidth: x.width,
            oheight: x.height,
            tags: `${x.author},${x.url}`,
            user: x.author,
            downloads: 0,
            views: 0,
          }));

          // if no more data (reached the last page)
          if (photoArr.length === 0) {
            setHasMoreData(false);
          } else {
            setPhotos([...photos, ...photoArr]);
          }
        },
        (error) => {
          setFetchError(error);
        }
      );
  };

  return (
    <>
      {fetchError ? (
        <p className={"fetchError"} data-testid={"fetchError"}>
          Failed to fetch photos, please try again later...
        </p>
      ) : (
        <InfiniteScroll
          data-testid={"infiniteScroll"}
          pageStart={1}
          loadMore={loadItems}
          hasMore={hasMoreData}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          <Gallery
            data-testid={"gallery"}
            photos={photos}
            onClick={openLightbox}
          />
          <ModalGateway>
            {viewerIsOpen ? (
              <Modal data-testid={"modal"} onClose={closeLightbox}>
                <Carousel
                  data-testid={"carousel"}
                  currentIndex={currentImage}
                  views={photos}
                  components={{ FooterCaption: PhotoDetails }}
                />
              </Modal>
            ) : null}
          </ModalGateway>
        </InfiniteScroll>
      )}
    </>
  );
}
