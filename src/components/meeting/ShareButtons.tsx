import { MessageCircle, Mail, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  inviteId: string;
  title: string;
  organizerName: string;
  slotsCount: number;
}

const ShareButtons = ({ inviteId, title, organizerName, slotsCount }: ShareButtonsProps) => {
  const appUrl = window.location.origin;
  const shareUrl = `${appUrl}/invite/${inviteId}`;
  
  // Short message - rich preview shows the rest!
  const message = `📅 Meeting invite from ${organizerName}: "${title}"\n${shareUrl}`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSmsShare = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const handleEmailShare = () => {
    const subject = `Meeting Invite: ${title}`;
    const body = `${organizerName} invites you to "${title}"\n\n${shareUrl}`;

    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `📅 Meeting Invite: ${title}`,
          text: `${organizerName} has invited you to "${title}". ${slotsCount} time slots to choose from.`,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled', err);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppShare}
        className="glass border-border/50 hover:bg-green-500/20 hover:border-green-500/50 w-full sm:w-auto justify-center rounded-xl gap-2 text-sm"
      >
        <MessageCircle className="h-4 w-4 text-green-500" />
        WhatsApp
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleSmsShare}
        className="glass border-border/50 hover:bg-blue-500/20 hover:border-blue-500/50 w-full sm:w-auto justify-center rounded-xl gap-2 text-sm"
      >
        <MessageCircle className="h-4 w-4 text-blue-500" />
        SMS
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleEmailShare}
        className="glass border-border/50 hover:bg-orange-500/20 hover:border-orange-500/50 w-full sm:w-auto justify-center rounded-xl gap-2 text-sm"
      >
        <Mail className="h-4 w-4 text-orange-500" />
        Email
      </Button>

      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="glass border-border/50 hover:bg-primary/20 hover:border-primary/50 w-full sm:w-auto justify-center rounded-xl gap-2 text-sm"
        >
          <Share2 className="h-4 w-4 text-primary" />
          Share
        </Button>
      )}
    </div>
  );
};

export default ShareButtons;
