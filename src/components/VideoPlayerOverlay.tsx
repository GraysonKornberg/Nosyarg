import React, { useState } from "react";

const VideoPlayerOverlay = ({
    isVisible,
    onClose,
    playlistId,
}: {
    isVisible: boolean;
    onClose: () => void;
    playlistId: string;
}) => {
    if (!isVisible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&loop=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ borderRadius: "10px", border: "none" }}
            ></iframe>
            <button
                onClick={onClose}
                style={{ position: "absolute", top: "20px", right: "20px" }}
            >
                Close
            </button>
        </div>
    );
};

export default VideoPlayerOverlay;
