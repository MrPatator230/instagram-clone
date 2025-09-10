import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiGrid, FiUser, FiCamera } from 'react-icons/fi';
import { postsAPI } from '../utils/api';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px var(--shadow-light);
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 48px;
  margin: 0 auto 20px;
  box-shadow: 0 8px 25px var(--shadow-medium);
`;

const ProfileUsername = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const ProfileFullName = styled.h2`
  font-size: 18px;
  color: var(--text-light);
  font-weight: normal;
  margin-bottom: 16px;
`;

const ProfileBio = styled.p`
  color: var(--text-dark);
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ProfileStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--text-dark);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-light);
  margin-top: 4px;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const PostCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px var(--shadow-light);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px var(--shadow-medium);
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
`;

const PostInfo = styled.div`
  padding: 16px;
`;

const PostCaption = styled.p`
  color: var(--text-dark);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostStats = styled.div`
  display: flex;
  gap: 16px;
  color: var(--text-light);
  font-size: 14px;
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
  color: var(--primary-orange);
`;

const EmptyStateTitle = styled.h3`
  font-size: 20px;
  color: var(--text-dark);
  margin-bottom: 10px;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
`;

export const Profile = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserPosts();
  }, [username]);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getUserPosts(username);
      setPosts(response.data.posts);
      setError('');
    } catch (err) {
      setError('Failed to load user posts. Please try again.');
      console.error('Load user posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (username, fullName) => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return username[0].toUpperCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingMessage>Loading profile...</LoadingMessage>
      </ProfileContainer>
    );
  }

  if (error && posts.length === 0) {
    return (
      <ProfileContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </ProfileContainer>
    );
  }

  // Get user info from the first post, or use username if no posts
  const userInfo = posts.length > 0 ? posts[0] : { username };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <ProfileAvatar>
          {userInfo.avatar ? (
            <img 
              src={userInfo.avatar} 
              alt={userInfo.username} 
              style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
            />
          ) : (
            getUserInitials(userInfo.username, userInfo.full_name)
          )}
        </ProfileAvatar>
        
        <ProfileUsername>@{userInfo.username}</ProfileUsername>
        
        {userInfo.full_name && (
          <ProfileFullName>{userInfo.full_name}</ProfileFullName>
        )}
        
        {userInfo.bio && (
          <ProfileBio>{userInfo.bio}</ProfileBio>
        )}

        <ProfileStats>
          <StatItem>
            <StatNumber>{posts.length}</StatNumber>
            <StatLabel>Posts</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>
              {posts.reduce((total, post) => total + parseInt(post.likes_count || 0), 0)}
            </StatNumber>
            <StatLabel>Likes</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>
              {posts.reduce((total, post) => total + parseInt(post.comments_count || 0), 0)}
            </StatNumber>
            <StatLabel>Comments</StatLabel>
          </StatItem>
        </ProfileStats>
      </ProfileHeader>

      {posts.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>
            <FiCamera />
          </EmptyStateIcon>
          <EmptyStateTitle>No posts yet</EmptyStateTitle>
          <EmptyStateText>
            {userInfo.username} hasn't shared any moments yet.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post.id}>
              <PostImage 
                src={`http://localhost:5000${post.image_url}`} 
                alt={post.caption || 'Post'} 
              />
              <PostInfo>
                {post.caption && (
                  <PostCaption>{post.caption}</PostCaption>
                )}
                <PostStats>
                  <span>❤️ {post.likes_count || 0}</span>
                  <span>💬 {post.comments_count || 0}</span>
                  <span>{formatDate(post.created_at)}</span>
                </PostStats>
              </PostInfo>
            </PostCard>
          ))}
        </PostsGrid>
      )}
    </ProfileContainer>
  );
};