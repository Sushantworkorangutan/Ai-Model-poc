import React, { forwardRef, useEffect, useState } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

import { useConnectionQuality } from "../logic/useConnectionQuality";
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState, stopAvatar } = useStreamingAvatarSession();
  const { connectionQuality } = useConnectionQuality();

  const isLoaded = sessionState === StreamingAvatarSessionState.CONNECTED;


  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setErrorMessage('There was a problem connecting. Please try again.');
  
        // Refresh after 10 seconds of showing the error
        setTimeout(() => {
          window.location.reload();
        }, 10000); // 10 seconds
      }
    }, 30000); // Wait 30 seconds before showing error
  
    return () => clearTimeout(timeout); // Cleanup
  }, [isLoaded]);
  


  return (
    <>
      {connectionQuality !== ConnectionQuality.UNKNOWN && (
        <div className="absolute bg-green-950/40 top-3 left-3 bg-black text-white rounded-lg px-3 py-2">
          Connection Quality: {connectionQuality}
        </div>
      )}
      {isLoaded && (
        <Button
          className="absolute top-3 right-3 !p-2 bg-zinc-700 bg-opacity-50 z-10"
          onClick={stopAvatar}
        >
          <CloseIcon />
        </Button>
      )}
      <video
        ref={ref}
        autoPlay
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      >
        <track kind="captions" />
      </video>
      {!isLoaded ? (
  <div className="w-full h-full flex items-center justify-center absolute top-0 left-0">
    {errorMessage ? (
      <div className="text-red-500 font-semibold">{errorMessage}</div>
    ) : (
      <div>Loading...</div>
    )}
  </div>
) : null}

    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
