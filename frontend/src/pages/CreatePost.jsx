import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiImage, FiX, FiUpload } from 'react-icons/fi';
import { postsAPI } from '../utils/api';

const CreateContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const CreateCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px var(--shadow-medium);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: var(--text-light);
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
`;

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed var(--light-peach);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: ${props => props.hasImage ? 'transparent' : 'var(--warm-cream)'};

  &:hover {
    border-color: var(--primary-orange);
    background: var(--light-peach);
  }

  &.dragover {
    border-color: var(--primary-orange);
    background: var(--light-peach);
  }
`;

const ImagePreview = styled.div`
  position: relative;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.8);
  }
`;

const UploadPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-light);
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: var(--primary-orange);
`;

const UploadText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const UploadHint = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const HiddenInput = styled.input`
  display: none;
`;

const CaptionTextarea = styled.textarea`
  padding: 16px;
  border: 2px solid var(--light-peach);
  border-radius: 12px;
  font-size: 16px;
  background: var(--white);
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    border-color: var(--primary-orange);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }

  &::placeholder {
    color: var(--text-light);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 120px;

  &.primary {
    background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-red) 100%);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px var(--shadow-medium);
    }
  }

  &.secondary {
    background: var(--light-gray);
    color: var(--text-dark);
    
    &:hover:not(:disabled) {
      background: var(--light-peach);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.1);
  color: var(--secondary-red);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

export const CreatePost = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      setError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      if (caption.trim()) {
        formData.append('caption', caption.trim());
      }

      await postsAPI.createPost(formData);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CreateContainer>
      <CreateCard>
        <Title>🔥 Share a Warm Moment</Title>
        <Subtitle>Upload a photo and share your story with the Ferrosocial community</Subtitle>

        <CreateForm onSubmit={handleSubmit}>
          <ImageUploadArea
            onClick={() => !selectedImage && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            hasImage={!!imagePreview}
          >
            {imagePreview ? (
              <ImagePreview>
                <PreviewImage src={imagePreview} alt="Preview" />
                <RemoveImageButton type="button" onClick={removeImage}>
                  <FiX />
                </RemoveImageButton>
              </ImagePreview>
            ) : (
              <UploadPrompt>
                <UploadIcon>
                  <FiImage />
                </UploadIcon>
                <UploadText>Click or drag an image here</UploadText>
                <UploadHint>Supports JPG, PNG, GIF (max 5MB)</UploadHint>
              </UploadPrompt>
            )}
            
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
            />
          </ImageUploadArea>

          <CaptionTextarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption for your post... What makes this moment special? ✨"
            maxLength={2000}
          />

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <Button
              type="button"
              className="secondary"
              onClick={() => navigate('/')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="primary"
              disabled={!selectedImage || isUploading}
            >
              {isUploading ? (
                <>
                  <FiUpload style={{ marginRight: '8px' }} />
                  Sharing...
                </>
              ) : (
                'Share Post'
              )}
            </Button>
          </ButtonGroup>
        </CreateForm>
      </CreateCard>
    </CreateContainer>
  );
};