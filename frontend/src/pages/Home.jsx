import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postsAPI } from '../utils/api';
import { Post } from '../components/Post';
import { CreatePostButton } from '../components/CreatePostButton';

const HomeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Welcome = styled.div`
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  color: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px var(--shadow-medium);
`;

const WelcomeTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.9;
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--text-light);
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--secondary-red);
  font-size: 16px;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 12px;
  margin: 20px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
`;

const EmptyStateIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const EmptyStateTitle = styled.h3`
  font-size: 20px;
  color: var(--text-dark);
  margin-bottom: 10px;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const LoadMoreButton = styled.button`
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin: 20px auto;
  display: block;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px var(--shadow-medium);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = async (pageNumber = 1, append = false) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);
      
      const response = await postsAPI.getFeed(pageNumber, 10);
      const newPosts = response.data.posts;

      if (append) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(newPosts.length === 10);
      setError('');
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Load posts error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, true);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  const handlePostCreated = () => {
    // Reload the feed when a new post is created
    loadPosts();
  };

  if (loading) {
    return (
      <HomeContainer>
        <Welcome>
          <WelcomeTitle>🔥 Welcome to Ferrosocial</WelcomeTitle>
          <WelcomeSubtitle>Share your warmest moments with the world</WelcomeSubtitle>
        </Welcome>
        <LoadingMessage>Loading your feed...</LoadingMessage>
      </HomeContainer>
    );
  }

  if (error && posts.length === 0) {
    return (
      <HomeContainer>
        <Welcome>
          <WelcomeTitle>🔥 Welcome to Ferrosocial</WelcomeTitle>
          <WelcomeSubtitle>Share your warmest moments with the world</WelcomeSubtitle>
        </Welcome>
        <ErrorMessage>{error}</ErrorMessage>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <Welcome>
        <WelcomeTitle>🔥 Welcome to Ferrosocial</WelcomeTitle>
        <WelcomeSubtitle>Share your warmest moments with the world</WelcomeSubtitle>
      </Welcome>

      <CreatePostButton onPostCreated={handlePostCreated} />

      {posts.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>📸</EmptyStateIcon>
          <EmptyStateTitle>No posts yet</EmptyStateTitle>
          <EmptyStateText>
            Be the first to share a moment! Create your first post above.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <PostsContainer>
          {posts.map((post) => (
            <Post 
              key={post.id} 
              post={post} 
              onUpdate={handlePostUpdate}
            />
          ))}
          
          {hasMore && (
            <LoadMoreButton 
              onClick={handleLoadMore} 
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load More Posts'}
            </LoadMoreButton>
          )}
        </PostsContainer>
      )}
    </HomeContainer>
  );
};