import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';

const PostList = ({ initialPosts }) => { 
    const [posts, setPosts] = useState([]);

    const URL = 'https://jsonplaceholder.typicode.com/posts';

    useEffect(() => {
        fetch(URL)
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => console.error('Error al obtener los datos:', error));
    }, []);

    return (
        <>
            <h1>Publicaciones</h1>
            <div>
                {posts.map((post) => ( 
                    <PostCard
                        key={post.id}
                        title={post.title}
                        body={post.body}
                        id={post.id}
                    />
                ))}
            </div>
        </>
    );
};

export default PostList;
