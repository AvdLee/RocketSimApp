import React from "react";

interface YoutubeProps {
  id?: string;
  url?: string;
  title?: string;
  className?: string;
}

const Youtube = ({ id, url, title = "YouTube video", className }: YoutubeProps) => {
  // Extract video ID from URL if provided
  let videoId = id;
  if (url && !videoId) {
    const urlPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/,
      /youtube\.com\/embed\/([^?/]+)/,
    ];

    for (const pattern of urlPatterns) {
      const match = url.match(pattern);
      if (match) {
        videoId = match[1];
        break;
      }
    }
  }

  if (!videoId) {
    return (
      <div className="text-red-600">
        Error: YouTube video ID or URL is required
      </div>
    );
  }

  return (
    <div className={`youtube-embed ${className || ""}`} style={{ width: "100%" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", width: "100%" }}>
        <iframe
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Youtube;
