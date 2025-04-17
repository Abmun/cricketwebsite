import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiClock, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import './HomePage.css';
import Loader from '../components/common/Loader';
import NewsCard from '../components/news/NewsCard';
import MatchCard from '../components/matches/MatchCard';
import AdBanner from '../components/ads/AdBanner';
import SocialWidget from '../components/widgets/SocialWidget';
import PlayerRankingWidget from '../components/widgets/PlayerRankingWidget';
import NewsletterSignup from '../components/common/NewsletterSignup';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Parallel API calls for better performance
        const [newsRes, matchesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/news`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/matches`)
        ]);

        // Process news data
        const allNews = newsRes.data || [];
        setFeaturedNews(allNews.filter(news => news.featured).slice(0, 5));
        setLatestNews(allNews.filter(news => !news.featured).slice(0, 12));

        // Process matches data
        const allMatches = matchesRes.data || [];
        setLiveMatches(allMatches.filter(match => match.status === 'live').slice(0, 3));
        setUpcomingMatches(allMatches.filter(match => match.status === 'upcoming').slice(0, 5));
        setCompletedMatches(allMatches.filter(match => match.status === 'completed').slice(0, 5));
        
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Auto-rotate featured news slider
    const sliderInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.max(featuredNews.length, 1));
    }, 5000);

    return () => clearInterval(sliderInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-slider">
            <div className="slider-controls">
              <button onClick={prevSlide} className="slider-control prev" aria-label="Previous slide">
                <FiChevronLeft />
              </button>
              <button onClick={nextSlide} className="slider-control next" aria-label="Next slide">
                <FiChevronRight />
              </button>
            </div>
            
            <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {featuredNews.map((news, index) => (
                <div className="slide" key={news.id}>
                  <div className="slide-image">
                    <img src={news.coverImage} alt={news.title} />
                  </div>
                  <div className="slide-content">
                    <div className="category-badge">{news.category}</div>
                    <h2><Link to={`/news/${news.slug}`}>{news.title}</Link></h2>
                    <div className="slide-meta">
                      <span className="author">By {news.author}</span>
                      <span className="date"><FiClock /> {new Date(news.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="excerpt">{news.excerpt}</p>
                    <Link to={`/news/${news.slug}`} className="read-more">Read More</Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="slider-dots">
              {featuredNews.map((_, index) => (
                <button 
                  key={index} 
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="live-matches-section">
          <div className="container">
            <h2 className="section-title">Live Matches</h2>
            <div className="live-matches">
              {liveMatches.map(match => (
                <MatchCard key={match.id} match={match} isLive={true} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="main-content-section">
        <div className="container">
          <div className="content-grid">
            {/* Latest News */}
            <div className="main-column">
              <h2 className="section-title">Latest News</h2>
              <div className="latest-news-grid">
                {latestNews.map(news => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
              <div className="view-more-container">
                <Link to="/news" className="view-more-btn">View All News</Link>
              </div>
              
              <AdBanner className="main-ad" />
              
              {/* Upcoming Matches */}
              <h2 className="section-title">Upcoming Matches</h2>
              <div className="matches-list">
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              <div className="view-more-container">
                <Link to="/matches" className="view-more-btn">View All Matches</Link>
              </div>
              
              {/* Recent Results */}
              <h2 className="section-title">Recent Results</h2>
              <div className="matches-list">
                {completedMatches.map(match => (
                  <MatchCard key={match.id} match={match} isCompleted={true} />
                ))}
              </div>
              <div className="view-more-container">
                <Link to="/matches?status=completed" className="view-more-btn">View All Results</Link>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="sidebar">
              <div className="sidebar-section">
                <h3 className="sidebar-title">Player Rankings</h3>
                <PlayerRankingWidget />
              </div>
              
              <AdBanner className="sidebar-ad" />
              
              <div className="sidebar-section">
                <h3 className="sidebar-title">Follow Us</h3>
                <SocialWidget />
              </div>
              
              <div className="sidebar-section">
                <h3 className="sidebar-title">Newsletter</h3>
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
