import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.svg';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import { logout, auth } from '../../firebase';

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredMovies, setFilteredMovies] = useState([]); // State for filtered movies list
  const [apiDataSet, setApiDataSet] = useState([]); // State to hold all fetched movies

  // we have created this just for adding darker background to nav while we scroll down for better visibility
  const navRef = useRef();

  // logic for adding dark background to the nav while scrolling vertically 
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY >= 80) {
          navRef.current.classList.add('nav-dark');
        } else {
          navRef.current.classList.remove('nav-dark');
        }
      }
    };

    // Check karo agar DOM fully ready hai
    if (navRef.current) {
      window.addEventListener('scroll', handleScroll);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navRef.current]); // Dependency array mein `navRef.current` add karo

  // Get the current user's info when the component mounts
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName || '');
    }
  }, []);

  // Fetch movies data
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjAwNmU2OTFkNzA5MDNjMGIzOTkxZDc5YzIwYjdlZSIsIm5iZiI6MTczMjUyMDA2OC4wNDc2MDQ4LCJzdWIiOiI2NzQ0Mjc1NjRkNTBjY2Q3ZGE0OGM4ZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vO82z1WpegCe7fCY0cfRf-3gpJdBlMBReDb8yzTBPvo'
      }
    };

    fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`, options)
      .then((res) => res.json())
      .then((res) => setApiDataSet(res.results))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Filter movies where the title starts with the searchTerm (case-insensitive)
      const filtered = apiDataSet.filter((movie) =>
        movie.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies([]); // No filtering if searchTerm is empty
    }
  }, [searchTerm, apiDataSet]);

  // Update the useEffect for disabling vertical scrolling and pointer events
  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('disable-pointer-events');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('disable-pointer-events');
    }
  
    // Cleanup when the component is unmounted or when the search overlay is closed
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('disable-pointer-events');
    };
  }, [showSearch]);  // Dependency array ensures it runs whenever `showSearch` changes

  // Navigate to profile page
  const goToProfile = () => {
    navigate('/profile');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm(''); // Reset the search term when closing the search overlay
    }
  };

  // Handle movie click to navigate to Player page
  const handleMovieClick = (movieId) => {
    navigate(`/player/${movieId}`); // Navigate to the Player page with the movie ID
  };

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="" />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>

      <div className="navbar-right">
        <img src={search_icon} alt="" className="icons" onClick={toggleSearch} />
        <p>Children</p>
        <img src={bell_icon} alt="" className="icons" />
        <div className="navbar-profile">
          <img src={profile_img} alt="" className="profile" />
          <img src={caret_icon} alt="" />
          <div className="dropdown-menu">
            <p onClick={goToProfile}>Profile</p>
            <p>Settings</p>
            <p>Contact</p>
            <p onClick={() => { logout(); }}>Sign Out</p>
          </div>
        </div>
      </div>

      {/* Search Layer */}
      {showSearch && (
        <div className={`search-overlay ${showSearch ? 'show' : ''}`}>
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Handle input changes
                autoFocus
              />
              <img src={search_icon} alt="Search Icon" className="search-icon-inside" />
            </div>
            <span className="close-btn" onClick={toggleSearch}>&times;</span>

            {/* Display filtered movies or no data message */}
            {searchTerm && filteredMovies.length === 0 ? (
              <div className="no-data-message">
                No Data for "{searchTerm}"
              </div>
            ) : (
              filteredMovies.length > 0 && (
                <div className="search-results">
                  {filteredMovies.map((movie) => (
                    <div key={movie.id} className="search-item" onClick={() => handleMovieClick(movie.id)}>
                      <div className="search-item-thumbnail">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          className="search-item-image"
                        />
                      </div>
                      <span>{movie.title}</span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
