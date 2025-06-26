
import { format } from "date-fns";

interface ImageGeneratorProps {
  title: string;
  organizer: string;
  timeSlots: string[];
}

export const generateSocialImage = ({ title, organizer, timeSlots }: ImageGeneratorProps): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas not supported');
    
    // Set canvas size for social media (1200x630 is optimal for most platforms)
    canvas.width = 1200;
    canvas.height = 630;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3B82F6'); // Blue-500
    gradient.addColorStop(1, '#1E40AF'); // Blue-700
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some visual elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    // Set text properties
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Title (with word wrapping for long titles)
    ctx.font = 'bold 56px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    const maxTitleLength = 40;
    const displayTitle = title.length > maxTitleLength ? title.substring(0, maxTitleLength) + '...' : title;
    ctx.fillText(displayTitle, canvas.width / 2, 140);
    
    // Organizer
    ctx.font = '36px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`Organized by ${organizer}`, canvas.width / 2, 220);
    
    // Separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 260);
    ctx.lineTo(900, 260);
    ctx.stroke();
    
    // Time slots header
    ctx.font = 'bold 32px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Available Times:', canvas.width / 2, 320);
    
    // Time slots (show first 3)
    ctx.font = '28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    const slotsToShow = timeSlots.slice(0, 3);
    slotsToShow.forEach((slot, index) => {
      try {
        const formattedSlot = format(new Date(slot), 'EEE, MMM d - h:mm a');
        ctx.fillText(formattedSlot, canvas.width / 2, 380 + (index * 45));
      } catch (error) {
        console.error('Error formatting date:', slot, error);
        ctx.fillText(slot, canvas.width / 2, 380 + (index * 45));
      }
    });
    
    // Show more indicator if there are more slots
    if (timeSlots.length > 3) {
      ctx.font = '24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(`+${timeSlots.length - 3} more times available`, canvas.width / 2, 520);
    }
    
    // Call to action
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('Click to share your availability!', canvas.width / 2, 580);
    
    // Convert to data URL with high quality
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error generating social image:', error);
    // Return a fallback image URL
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop&crop=center&auto=format';
  }
};
