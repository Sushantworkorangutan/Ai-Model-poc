'use client'
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import React from "react";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";
import { useStreamingAvatarContext } from "../logic/context";


export const AvatarControls: React.FC = () => {
  const {
    isVoiceChatLoading,
    isVoiceChatActive,
    startVoiceChat,
    stopVoiceChat,
  } = useVoiceChat();
  const { interrupt } = useInterrupt();


  const {setStartQuiz,startQuiz}=useStreamingAvatarContext()

  return (
    <div className="flex flex-col gap-2 relative w-full items-center">
  {/* Top control bar */}
  <div className="w-full flex flex-col xl:flex-row gap-2 justify-between items-center">
    {/* Toggle group (Voice/Text) */}
    <div className="w-full flex flex-wrap gap-2 justify-center xl:justify-start">
      <ToggleGroup
        className={`flex gap-2 bg-[#ef3c52]/70 rounded-lg p-1 ${
          isVoiceChatLoading ? "opacity-50" : ""
        }`}
        disabled={isVoiceChatLoading}
        type="single"
        value={isVoiceChatActive || isVoiceChatLoading ? "voice" : "text"}
        onValueChange={(value) => {
          if (value === "voice" && !isVoiceChatActive && !isVoiceChatLoading) {
            startVoiceChat();
          } else if (
            value === "text" &&
            isVoiceChatActive &&
            !isVoiceChatLoading
          ) {
            stopVoiceChat();
          }
        }}
      >
        <ToggleGroupItem
          className="data-[state=on]:bg-[#ef3c52] text-white rounded-lg
                     w-full sm:w-[110px]
                     text-xs sm:text-sm lg:text-base
                     px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2"
          value="voice"
        >
          Voice Chat
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-[#ef3c52] text-white rounded-lg
                     w-full sm:w-[110px]
                     text-xs sm:text-sm lg:text-base
                     px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2"
          value="text"
        >
          Text Chat
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

  

  {/* Interrupt button - responsive */}
  <div className="w-full flex justify-center xl:justify-end  mt-2 gap-2">
    {/* Quiz button */}
    {/* <Button
      className="bg-[#ef3c52] text-white rounded-lg
                 w-full sm:w-auto
                 text-xs sm:text-sm lg:text-base
                 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2"
      onClick={() => setStartQuiz((prev) => (prev === null ? true : !prev))}
    >
      {startQuiz === null || !startQuiz ? "Start Quiz" : "End Quiz"}
    </Button> */}
    <Button
      className="!bg-[#ef3c52]/70 !text-white
                 w-full sm:w-auto
                 text-xs sm:text-sm lg:text-base
                 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2"
      onClick={interrupt}
    >
      Interrupt
    </Button>
  </div>
  </div>
</div>

  
  
  );
};
