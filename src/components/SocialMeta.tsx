
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

    // Use an image showing people collaborating online
    const collaborationImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop&crop=center&auto=format';
    const defaultImage = collaborationImage;

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

    // Update description with clear call to action - emoji helps stand out in messaging apps
    const enhancedDescription = `📅 MÖTESINBJUDAN: ${description} — Klicka för att välja tider som passar dig!`;
    updateMetaTag('description', enhancedDescription, true);
    
    // Update Open Graph tags - these are what WhatsApp, iMessage, etc. use
    updateMetaTag('og:title', `📅 Mötesinbjudan: ${title}`);
    updateMetaTag('og:description', enhancedDescription);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:image', image || defaultImage);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:site_name', 'TimeSlot - Mötesbokningar');
    if (url) updateMetaTag('og:url', url);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', `📅 Mötesinbjudan: ${title}`, true);
    updateMetaTag('twitter:description', enhancedDescription, true);
    updateMetaTag('twitter:image', image || defaultImage, true);

    return () => {
      // Cleanup function - restore default values when component unmounts
      document.title = 'TimeSlot - Simple Meeting Scheduling';
      updateMetaTag('description', 'The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.', true);
      updateMetaTag('og:title', 'TimeSlot - Simple Meeting Scheduling');
      updateMetaTag('og:description', 'The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.');
      updateMetaTag('og:image', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=630&fit=crop&crop=center&auto=format');
      updateMetaTag('twitter:title', 'TimeSlot - Simple Meeting Scheduling', true);
      updateMetaTag('twitter:description', 'The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.', true);
      updateMetaTag('twitter:image', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=630&fit=crop&crop=center&auto=format', true);
    };
  }, [title, description, image, url]);

  return null;
};

export default SocialMeta;
