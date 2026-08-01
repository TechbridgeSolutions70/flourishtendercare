import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

function NewsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('posts').select('*').limit(3);
        if (!error) setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="events" className="section">
      <div className="section-heading">
        <p className="eyebrow">Latest updates</p>
        <h2>News and events</h2>
      </div>
      {loading ? (
        <p>Loading updates...</p>
      ) : (
        <div className="news-grid">
          {posts.length > 0 ? posts.map((post) => (
            <article key={post.id} className="news-card">
              <h3>{post.title || 'School update'}</h3>
              <p>{post.content || 'More updates coming soon.'}</p>
            </article>
          )) : <p>No content available yet.</p>}
        </div>
      )}
    </section>
  );
}

export default NewsSection;
