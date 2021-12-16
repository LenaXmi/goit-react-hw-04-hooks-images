import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { animateScroll as scroll } from "react-scroll";
import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";
import LoadMore from "./components/Button";
import API from "./services/image-api.js";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [imageArr, setImageArr] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalAlt, setModalAlt] = useState("null");

  useEffect(() => {
    let controller = new AbortController();
    let signal = controller.signal;

    if (searchQuery === "") {
      return;
    }

    setStatus("pending");

    API(searchQuery, page, { signal })
      .then((response) => {
        const { hits } = response;
        if (searchQuery !== "" && hits.length !== 0 && page === 1) {
          toast.success("Images found");
          setImageArr(hits);
          setStatus("resolved");
        }
        if (response.hits.length !== 0 && page > 1) {
          setImageArr((prevImageArr) => [...prevImageArr, ...hits]);
          setStatus("resolved");
          scroll.scrollToBottom(100);
        }

        if (hits.length === 0) {
          toast.error("Images not found");
          setStatus("idle");
        }
      })
      .catch((error) => {
        setError(error);
        setStatus("rejected");
      });
    return () => controller.abort();
  }, [searchQuery, page]);

  const handleFormSubmit = (searchQuery) => {
    setImageArr([]);
    setSearchQuery(searchQuery);
    setPage(1);
  };

  const openModal = (arrayEl) => {
    const { largeImageURL, tags } = arrayEl;
    setShowModal(true);
    setModalImage(largeImageURL);
    setModalAlt(tags);
  };

  const closeModal = (e) => {
    setShowModal(false);
    setModalImage(null);
    setModalAlt(null);
  };

  return (
    <div className="App">
      <ToastContainer />
      <Searchbar submit={handleFormSubmit} />

      {status === "resolved" && (
        <>
          <ImageGallery imageArray={imageArr} onImgClick={openModal} />
          {imageArr.length >= 12 && (
            <LoadMore fetchMoreImg={() => setPage(page + 1)} />
          )}
        </>
      )}

      {status === "pending" && (
        <>
          <ImageGallery imageArray={imageArr} onImgClick={openModal} />
          <Loader
            type="ThreeDots"
            color="#3f51b5"
            height={70}
            width={70}
            timeout={2000}
          />
        </>
      )}

      {showModal && (
        <Modal modalClose={closeModal}>
          <img src={modalImage} alt={modalAlt} />
        </Modal>
      )}
      {status === "rejected" && <div>{error.message}</div>}
    </div>
  );
}

//Class component without hooks
// class App extends Component {
//   state = {
//     imageArr: [],
//     searchQuery: "",
//     page: 1,
//     status: "idle",
//     error: null,
//     showModal: false,
//     modalImage: null,
//     modalAlt: null,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const { searchQuery, page } = this.state;

//     if (prevState.searchQuery !== searchQuery) {
//       this.setState({ status: "pending" });

//       API(searchQuery, page)
//         .then((response) =>
//           this.setState({
//             imageArr: response.hits,
//             page: 1,
//             status: "resolved",
//           })
//         )
//         .catch((error) => this.setState({ error, status: "rejected" }));
//     }

//     if (prevState.page !== page && page !== 1) {
//       this.setState({ status: "pending" });

//       API(searchQuery, page)
//         .then(
//           (response) =>
//             this.setState((prevState) => ({
//               imageArr: [...prevState.imageArr, ...response.hits],
//             })),
//           this.setState({ status: "resolved" })
//         )
//         .catch((error) => this.setState({ error, status: "rejected" }));
//       scroll.scrollToBottom(200);
//     }
//   }

//   handleFormSubmit = (searchQuery) => {
//     this.setState({ imageArr: [], searchQuery, page: 1 });
//   };
//   onLoadMore = () => {
//     this.setState((prevState) => ({
//       page: prevState.page + 1,
//     }));
//   };

//   openModal = (arrayEl) => {
//     const { largeImageURL, tags } = arrayEl;
//     this.setState({
//       showModal: true,
//       modalImage: largeImageURL,
//       modalAlt: tags,
//     });
//   };

//   closeModal = (e) => {
//     this.setState({
//       showModal: false,
//       modalImage: null,
//       modalAlt: null,
//     });
//   };

//   render() {
//     const { imageArr, showModal, modalImage, modalAlt, status, error } =
//       this.state;
//     return (
//       <div className="App">
//         <Searchbar submit={this.handleFormSubmit} />

//         {status === "resolved" && (
//           <>
//             <ImageGallery imageArray={imageArr} onImgClick={this.openModal} />
//             {imageArr.length === 0 && <h1>No images found</h1>}
//             {imageArr.length >= 12 && (
//               <LoadMore fetchMoreImg={this.onLoadMore} />
//             )}
//           </>
//         )}

//         {status === "pending" && (
//           <>
//             <ImageGallery imageArray={imageArr} onImgClick={this.openModal} />
//             <Loader
//               type="ThreeDots"
//               color="#3f51b5"
//               height={70}
//               width={70}
//               // timeout={3000}
//             />
//           </>
//         )}

//         {showModal && (
//           <Modal modalClose={this.closeModal}>
//             <img src={modalImage} alt={modalAlt} />
//           </Modal>
//         )}
//         {status === "rejected" && <div>{error.message}</div>}
//       </div>
//     );
//   }
// }

export default App;
