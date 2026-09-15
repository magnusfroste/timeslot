
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
    const enhancedDescription = `📅 MEETING INVITE: ${description} — Tap to pick the times that work for you!`;
    updateMetaTag('description', enhancedDescription, true);
    
    // Update Open Graph tags - these are what WhatsApp, iMessage, etc. use
    updateMetaTag('og:title', `📅 Meeting Invite: ${title}`);
    updateMetaTag('og:description', enhancedDescription);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:image', image || defaultImage);
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:site_name', 'Timeslot – Meeting Scheduling');
    if (url) updateMetaTag('og:url', url);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', `📅 Meeting Invite: ${title}`, true);
    updateMetaTag('twitter:description', enhancedDescription, true);
    updateMetaTag('twitter:image', image || defaultImage, true);

    return () => {
      // Cleanup function - restore default values when component unmounts
      document.title = 'Timeslot – The Easiest Way to Schedule Meetings with Your Team';
      updateMetaTag('description', 'The easiest way to find a time that works for your incredible team. Create time slots, share a link, and see availability in real-time. No sign-up required.', true);
      updateMetaTag('og:title', 'Timeslot – The Easiest Way to Schedule Meetings');
      updateMetaTag('og:description', 'The easiest way to find a time that works for your incredible team. Create time slots, share a link, and see availability in real-time. No sign-up required.');
      updateMetaTag('og:image', 'https://storage.googleapis.com/gpt-engineer-file-uploads/Otwc5k988dRBXnycfCqkhVYDdj42/social-images/social-1765287643321-Screenshot 2025-12-09 at 14.40.25.png');
      updateMetaTag('twitter:title', 'Timeslot – The Easiest Way to Schedule Meetings', true);
      updateMetaTag('twitter:description', 'The easiest way to find a time that works for your incredible team. Create time slots, share a link, and see availability in real-time. No sign-up required.', true);
      updateMetaTag('twitter:image', 'https://storage.googleapis.com/gpt-engineer-file-uploads/Otwc5k988dRBXnycfCqkhVYDdj42/social-images/social-1765287643321-Screenshot 2025-12-09 at 14.40.25.png', true);
    };
  }, [title, description, image, url]);

  return null;
};

export default SocialMeta;
