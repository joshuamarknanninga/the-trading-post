import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiMessageSquare, FiCalendar, FiAlertTriangle } from 'react-icons/fi';

const CommunityBoard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/community/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/community/posts', {
        content: newPost,
        category: selectedCategory
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setPosts([data, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share something with the community..."
            className="w-full p-2 border rounded-lg h-24"
            required
          />
          <div className="flex justify-between items-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded-lg"
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="alert">Alert</option>
              <option value="question">Question</option>
            </select>
            <button type="submit" className="btn-primary">
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading community posts...</div>
        ) : posts.filter(post => 
            selectedCategory === 'all' || post.category === selectedCategory
          ).map(post => (
          <div key={post._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {post.category === 'event' ? <FiCalendar className="text-blue-500" /> :
               post.category === 'alert' ? <FiAlertTriangle className="text-red-500" /> :
               <FiMessageSquare className="text-green-500" />}
              <span className="font-medium">{post.user.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-800">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityBoard;