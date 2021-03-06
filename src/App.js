
import React, { useEffect, useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import InfiniteScroll from 'react-infinite-scroll-component';


const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

function App() {

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const fetchPhotos = useCallback(() => {
    let apiUrl = `https://api.unsplash.com/photos/?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos/?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;
    console.log(apiUrl);

    fetch(apiUrl)
      .then(res => res.json())
      .then(
        data => {
          const imagesFromApi = data.results ?? data
          if (page === 1) return setImages(imagesFromApi);

          //if page>1, return the set appended to oter images
          setImages((images) => [...images, ...imagesFromApi]);
        }
      )

  }, [page, query])
  //returns memoized callback i.e it is called once and doesnt' change with every render



  function searchPhotos(e) {
    e.preventDefault();
    setPage(1);
    fetchPhotos();

    // fetch(`https://api.unsplash.com/search/photos/?client_id=${accessKey}&page=${page}&query=${query}`)
    //   .then(res => res.json())
    //   .then(
    //     data => {
    //       console.log(data)
    //       setImages(data.results);
    //     }
    //   )
    //   .catch(err => alert(err))
  }

  useEffect(() => {
    fetchPhotos();
    //esLint-disable-next-line

  }, [page, fetchPhotos])



  if (!accessKey) {
    return <a href="https://unsplash.com/developers"
      className="error">Required: Get your access key</a>
  }

  return (
    <div className="App">
      <h1>Unsplash Image Gallery</h1>
      <form onSubmit={searchPhotos} >
        <input type="text" placeholder="Search by keyword.." value={query} onChange={e => setQuery(e.target.value)} />
        <button>Search</button>

      </form>

      <InfiniteScroll
        dataLength={images.length} //This is important field to render the next data
        next={() => {
          setPage(page => page + 1);
          // fetchPhotos();
        }}
        hasMore={true}
        loader={<h4>Loading...</h4>}>

        {/* // below props only if you need pull down functionality
        // refreshFunction={this.refresh}
        // pullDownToRefresh
        // pullDownToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        // }
        // releaseToRefreshContent={
        //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        // }> */}
        <div className="image-grid">
          {images.map((image, index) =>
            (
              <a className="image" key={index} href={image.links.html} target="_blank" rel="noopener noreferrer"
              >
                <img src={image.urls.regular} alt={image.alt_description} />
              </a>
            )

          )}
        </div>
      </InfiniteScroll>

    </div>
  );
}

export default App;
