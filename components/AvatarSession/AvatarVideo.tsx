import React, { forwardRef, useEffect, useState } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

import { useConnectionQuality } from "../logic/useConnectionQuality";
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";
import Image from "next/image";

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
     <div className="relative w-full h-full flex items-center justify-center bg-black">
      <div className="flex xl:flex-row flex-col justify-center items-center ">

  <div className="absolute top-2 left-2 sm:top-4 sm:left-4">

  <Image src="/Franke-Logo.jpg" alt="logo" width={100} height={100} />
  </div>
  {/* {connectionQuality !== ConnectionQuality.UNKNOWN && (
    <div className="absolute top-4 left-4 sm:top-10 sm:left-10 bg-green-950/60 text-white rounded-md px-2 py-1 text-[10px] sm:text-xs">
      Connecion Quality : {connectionQuality}
    </div>
  )} */}
      </div>
  
  {isLoaded && (
    <Button
      className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 bg-zinc-700/50 text-white rounded-md"
      onClick={stopAvatar}
    >
      <CloseIcon className="w-3 h-3 sm:w-4 sm:h-4" />
    </Button>
  )}

  <video ref={ref} autoPlay playsInline className="w-full h-full object-contain" />
</div>


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
