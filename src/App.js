import { Component } from "react";
import Loader from "react-loader-spinner";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import * as Scroll from 'react-scroll';
import { animateScroll as scroll } from "react-scroll";
import Searchbar from "./components/Searchbar";
import ImageGallery from "./components/ImageGallery";
import LoadMore from "./components/Button";
import API from "./services/image-api.js";
import Modal from "./components/Modal";
import "./App.css";

class App extends Component {
  state = {
    imageArr: [],
    searchQuery: "",
    page: 1,
    status: "idle",
    error: null,
    showModal: false,
    modalImage: null,
    modalAlt: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;

    if (prevState.searchQuery !== searchQuery) {
      this.setState({ status: "pending" });

      API(searchQuery, page)
        .then((response) =>
          this.setState({
            imageArr: response.hits,
            page: 1,
            status: "resolved",
          })
        )
        .catch((error) => this.setState({ error, status: "rejected" }));
    }

    if (prevState.page !== page && page !== 1) {
      this.setState({ status: "pending" });

      API(searchQuery, page)
        .then(
          (response) =>
            this.setState((prevState) => ({
              imageArr: [...prevState.imageArr, ...response.hits],
            })),
          this.setState({ status: "resolved" })
        )
        .catch((error) => this.setState({ error, status: "rejected" }));
      scroll.scrollToBottom(200);
    }
  }

  handleFormSubmit = (searchQuery) => {
    this.setState({ imageArr: [], searchQuery, page: 1 });
  };
  onLoadMore = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }));
  };

  openModal = (arrayEl) => {
    const { largeImageURL, tags } = arrayEl;
    this.setState({
      showModal: true,
      modalImage: largeImageURL,
      modalAlt: tags,
    });
  };

  closeModal = (e) => {
    this.setState({
      showModal: false,
      modalImage: null,
      modalAlt: null,
    });
  };

  render() {
    const { imageArr, showModal, modalImage, modalAlt, status, error } =
      this.state;
    return (
      <div className="App">
        <Searchbar submit={this.handleFormSubmit} />

        {status === "resolved" && (
          <>
            <ImageGallery imageArray={imageArr} onImgClick={this.openModal} />
            {imageArr.length === 0 && <h1>No images found</h1>}
            {imageArr.length >= 12 && (
              <LoadMore fetchMoreImg={this.onLoadMore} />
            )}
          </>
        )}

        {status === "pending" && (
          <>
            <ImageGallery imageArray={imageArr} onImgClick={this.openModal} />
            <Loader
              type="ThreeDots"
              color="#3f51b5"
              height={70}
              width={70}
              // timeout={3000}
            />
          </>
        )}

        {showModal && (
          <Modal modalClose={this.closeModal}>
            <img src={modalImage} alt={modalAlt} />
          </Modal>
        )}
        {status === "rejected" && <div>{error.message}</div>}
      </div>
    );
  }
}

export default App;
