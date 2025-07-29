import React from "react";

const VideoHero = () => {
  return (
    <div className="w-full h-full">
      <video
        className="w-full h-full rounded-lg shadow-lg object-cover"
        src="https://nceimulixfgragdjxsqq.supabase.co/storage/v1/object/public/videogreenland/promocionVideo.mp4"
        controls
        muted
        playsInline
      />
    </div>
  );
};

export default VideoHero;