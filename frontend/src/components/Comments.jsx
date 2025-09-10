import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { commentsAPI } from '../utils/api';
import { useAuth } from '../hooks/useAuth.jsx';

const CommentsContainer = styled.div`
  border-top: 1px solid var(--light-peach);
  padding-top: 16px;
  margin-top: 12px;
`;

const CommentsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
`;

const Comment = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px 0;
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--soft-coral) 0%, var(--primary-orange) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const CommentUsername = styled.span`
  font-weight: 600;
  color: var(--text-dark);
  font-size: 14px;
`;

const CommentTime = styled.span`
  font-size: 12px;
  color: var(--text-light);
`;

const CommentText = styled.div`
  color: var(--text-dark);
  font-size: 14px;
  line-height: 1.4;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  background: none;
  color: var(--text-light);
  font-size: 14px;
  padding: 4px;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--secondary-red);
  }
`;

const AddCommentForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const CommentInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 2px solid var(--light-peach);
  border-radius: 12px;
  font-size: 14px;
  background: var(--white);
  transition: all 0.3s ease;
  resize: none;
  min-height: 40px;
  max-height: 100px;

  &:focus {
    border-color: var(--primary-orange);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: var(--text-light);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
  color: white;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 18px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-medium);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--text-light);
  font-size: 14px;
  padding: 20px;
`;

export const Comments = ({ postId, onClose }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getComments(postId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await commentsAPI.addComment(postId, newComment.trim());
      setComments([...comments, response.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await commentsAPI.deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getUserInitials = (username, fullName) => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return username[0].toUpperCase();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <CommentsContainer>
      {loading ? (
        <LoadingMessage>Loading comments...</LoadingMessage>
      ) : (
        <>
          {comments.length > 0 ? (
            <CommentsList>
              {comments.map((comment) => (
                <Comment key={comment.id}>
                  <CommentAvatar>
                    {comment.avatar ? (
                      <img 
                        src={comment.avatar} 
                        alt={comment.username} 
                        style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} 
                      />
                    ) : (
                      getUserInitials(comment.username, comment.full_name)
                    )}
                  </CommentAvatar>
                  <CommentContent>
                    <CommentHeader>
                      <CommentUsername>{comment.username}</CommentUsername>
                      <CommentTime>{formatDate(comment.created_at)}</CommentTime>
                    </CommentHeader>
                    <CommentText>{comment.content}</CommentText>
                  </CommentContent>
                  {user.id === comment.user_id && (
                    <CommentActions>
                      <DeleteButton 
                        type="button" 
                        onClick={() => handleDelete(comment.id)}
                      >
                        <FiTrash2 />
                      </DeleteButton>
                    </CommentActions>
                  )}
                </Comment>
              ))}
            </CommentsList>
          ) : (
            <EmptyState>No comments yet. Be the first to comment!</EmptyState>
          )}

          <AddCommentForm onSubmit={handleSubmit}>
            <CommentInput
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Add a comment..."
              disabled={submitting}
              rows={1}
            />
            <SendButton type="submit" disabled={!newComment.trim() || submitting}>
              <FiSend />
            </SendButton>
          </AddCommentForm>
        </>
      )}
    </CommentsContainer>
  );
};