import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full text-center py-6 bg-transparent flex flex-col items-center gap-2">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center justify-center">
        <Link
          to="/terms"
          className="text-sm text-white underline hover:text-blue-300 transition-colors"
        >
          Terms and Privacy Policy
        </Link>
        <span className="text-sm text-white opacity-80">&copy;BeatSomnia</span>
      </div>
    </footer>
  );
}