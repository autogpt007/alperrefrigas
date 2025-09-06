import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const BlogPostRedirect = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Redirect from /news/:slug to /blog/:slug for backward compatibility
  return <Navigate to={`/blog/${slug}`} replace />;
};

export default BlogPostRedirect;