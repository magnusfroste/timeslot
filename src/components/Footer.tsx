import { Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto pt-16 pb-8 text-center">
      <div className="inline-flex items-center justify-center gap-4 md:gap-6 glass rounded-full px-6 py-3 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <Heart className="h-4 w-4 text-red-500" />
          Timeslot
        </Link>
        <span className="w-px h-4 bg-border" />
        <span>Open Source (MIT)</span>
        <span className="w-px h-4 bg-border" />
        <a 
          href="https://github.com/magnusfroste/timeslot" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;
