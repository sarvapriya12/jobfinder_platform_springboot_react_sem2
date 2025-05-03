import React, { useState } from 'react';
import axios from 'axios';
import './UploadPhoto.css';

const UploadPhoto = ({ userId, onUploadSuccess, onClose }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Create preview URL
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !title.trim()) {
            setError('Please select a file and enter a title!');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('userId', userId);

        setUploading(true);
        setError('');
        
        try {
            const res = await axios.post('http://localhost:8080/api/photos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Call the success callback
            if (onUploadSuccess) {
                onUploadSuccess(res.data);
            } else {
                alert('Photo uploaded successfully!');
            }
            
            // Reset form
            setFile(null);
            setTitle('');
            setPreviewUrl(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data || 'Error uploading photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-photo-container">
            <div className="upload-photo-header">
                <h2>Upload Photo</h2>
                <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            
            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="photo-title">Title</label>
                    <input
                        id="photo-title"
                        type="text"
                        placeholder="Enter a title for your photo"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="photo-file">Choose photo</label>
                    <input
                        id="photo-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                    />
                </div>
                
                {previewUrl && (
                    <div className="preview-container">
                        <h3>Preview</h3>
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="image-preview" 
                        />
                    </div>
                )}
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-button" 
                        onClick={onClose}
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="upload-button" 
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadPhoto;