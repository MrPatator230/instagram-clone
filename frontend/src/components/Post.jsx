import { useState } from 'react';
import styled from 'styled-components';
import { FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import { Comments } from './Comments';

const PostCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px var(--shadow-light);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px var(--shadow-medium);
  }
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--light-peach);
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled(Link)`
  font-weight: 600;
  color: var(--text-dark);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-orange);
  }
`;

const FullName = styled.div`
  font-size: 14px;
  color: var(--text-light);
`;

const PostTime = styled.div`
  font-size: 12px;
  color: var(--text-light);
`;

const PostImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: cover;
  display: block;
`;

const PostContent = styled.div`
  padding: 20px;
`;

const PostActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
`;

const ActionButton = styled.button`
  background: none;
  color: var(--text-dark);
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-orange);
    transform: scale(1.1);
  }

  &.liked {
    color: var(--secondary-red);
  }
`;

const LikeCount = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: var(--text-dark);
  margin-bottom: 8px;
`;

const Caption = styled.div`
  margin-bottom: 12px;
  line-height: 1.5;
  
  strong {
    font-weight: 600;
    color: var(--text-dark);
    margin-right: 8px;
  }
`;

const ViewComments = styled.button`
  background: none;
  color: var(--text-light);
  font-size: 14px;
  margin-bottom: 12px;
  
  &:hover {
    color: var(--primary-orange);
  }
`;

export const Post = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await postsAPI.toggleLike(post.id);
      
      if (onUpdate) {
        onUpdate({
          likes_count: response.data.likes_count,
          is_liked: response.data.is_liked ? 1 : 0
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  const getUserInitials = (username, fullName) => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return username[0].toUpperCase();
  };

  return (
    <PostCard>
      <PostHeader>
        <Avatar>
          {post.avatar ? (
            <img src={post.avatar} alt={post.username} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
          ) : (
            getUserInitials(post.username, post.full_name)
          )}
        </Avatar>
        <UserInfo>
          <Username to={`/profile/${post.username}`}>
            {post.username}
          </Username>
          {post.full_name && <FullName>{post.full_name}</FullName>}
        </UserInfo>
        <PostTime>{formatDate(post.created_at)}</PostTime>
      </PostHeader>

      <PostImage 
        src={`http://localhost:5000${post.image_url}`} 
        alt={post.caption || 'Post image'} 
      />

      <PostContent>
        <PostActions>
          <ActionButton 
            onClick={handleLike}
            className={post.is_liked ? 'liked' : ''}
            disabled={isLiking}
          >
            {post.is_liked ? <FaHeart /> : <FiHeart />}
          </ActionButton>
          <ActionButton onClick={() => setShowComments(!showComments)}>
            <FiMessageCircle />
          </ActionButton>
        </PostActions>

        {post.likes_count > 0 && (
          <LikeCount>
            {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
          </LikeCount>
        )}

        {post.caption && (
          <Caption>
            <strong>{post.username}</strong>
            {post.caption}
          </Caption>
        )}

        {post.comments_count > 0 && !showComments && (
          <ViewComments onClick={() => setShowComments(true)}>
            View all {post.comments_count} comments
          </ViewComments>
        )}

        {showComments && (
          <Comments 
            postId={post.id} 
            onClose={() => setShowComments(false)}
          />
        )}
      </PostContent>
    </PostCard>
  );
};