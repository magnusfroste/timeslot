
import { format } from "date-fns";

interface ImageGeneratorProps {
  title: string;
  organizer: string;
  timeSlots: string[];
}

export const generateSocialImage = ({ title, organizer, timeSlots }: ImageGeneratorProps): string => {
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
  
  // Set text properties
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  
  // Title
  ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
  const titleText = title.length > 30 ? title.substring(0, 30) + '...' : title;
  ctx.fillText(titleText, canvas.width / 2, 150);
  
  // Organizer
  ctx.font = '32px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Organized by ${organizer}`, canvas.width / 2, 220);
  
  // Time slots header
  ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
  ctx.fillText('Available Times:', canvas.width / 2, 300);
  
  // Time slots (show first 3)
  ctx.font = '24px system-ui, -apple-system, sans-serif';
  const slotsToShow = timeSlots.slice(0, 3);
  slotsToShow.forEach((slot, index) => {
    const formattedSlot = format(new Date(slot), 'EEE, MMM d - h:mm a');
    ctx.fillText(formattedSlot, canvas.width / 2, 350 + (index * 40));
  });
  
  // Show more indicator if there are more slots
  if (timeSlots.length > 3) {
    ctx.font = '20px system-ui, -apple-system, sans-serif';
    ctx.fillText(`+${timeSlots.length - 3} more times`, canvas.width / 2, 470);
  }
  
  // Call to action
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.fillText('Click to share your availability', canvas.width / 2, 550);
  
  // Convert to data URL
  return canvas.toDataURL('image/png', 0.9);
};
