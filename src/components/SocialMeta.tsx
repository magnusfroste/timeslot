
import { useEffect } from 'react';

interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

const SocialMeta = ({ title, description, image, url }: SocialMetaProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isName) {
          meta.name = property;
        } else {
          meta.setAttribute('property', property);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update description
    updateMetaTag('description', description, true);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    if (image) updateMetaTag('og:image', image);
    if (url) updateMetaTag('og:url', url);

    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    if (image) updateMetaTag('twitter:image', image, true);

    return () => {
      // Cleanup function - restore default values when component unmounts
      document.title = 'TimeSlot - Simple Meeting Scheduling';
      updateMetaTag('description', 'The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.', true);
      updateMetaTag('og:title', 'TimeSlot - Simple Meeting Scheduling');
      updateMetaTag('og:description', 'The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.');
      updateMetaTag('twitter:title', 'TimeSlot - Simple Meeting Scheduling', true);
      updateMetaTag('twitter:description', 'The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.', true);
    };
  }, [title, description, image, url]);

  return null;
};

export default SocialMeta;
