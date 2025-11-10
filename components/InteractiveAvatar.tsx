import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";

import { Button } from "./Button";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistory";

import { AVATARS } from "@/app/lib/constants";
import NavBar from "./NavBar";
import { Nabla } from "next/font/google";
import { getVoiceAccentSettings, getVoiceModel } from "./logic/voiceSettings";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  knowledgeId: process.env.NEXT_PUBLIC_KNOWLEDGE_ID,
  voice: {
    rate: 1.0,
    emotion: VoiceEmotion.FRIENDLY,
    model: ElevenLabsModel.eleven_flash_v2_5,
    elevenlabsSettings:{
      stability: 0.6,
      similarity_boost: 0.9,
      style: 0.6,
      use_speaker_boost: true,
    }
  },
  language:"en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
    confidence:0.8
  },
  useSilencePrompt:true
};

function InteractiveAvatar() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);

  const mediaStream = useRef<HTMLVideoElement>(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.log("Error fetching access token:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        console.log(">>>>> User talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        console.log(">>>>> Avatar talking message:", event);
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });
      const { emotion, rate, style } = getVoiceAccentSettings(config.language || "en");
      const dynamicConfig: StartAvatarRequest = {
        ...config,
        voice: {
          ...config.voice,
          emotion,
          rate,
          model: getVoiceModel(config.language||"en"),
          elevenlabsSettings: {
            ...config.voice?.elevenlabsSettings,
            style,
          },
        },
        sttSettings: {
          ...config.sttSettings,
        },
      };
      await startAvatar(dynamicConfig);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.log("Error starting avatar session:", error);
    }
  });

  useUnmount(() => {
    stopAvatar();
  });


  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
<div className="w-full h-screen flex flex-col xl:flex-row gap-4 p-2 sm:p-4">
  {/* Left: Avatar + Controls */}
  <div className="flex-[3] flex flex-col bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
    
    {/* Video fills available space but leaves room for controls */}
    <div className="flex-1 relative flex items-center justify-center min-h-[300px] md:min-h-[400px] xl:min-h-0">
      {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
        <AvatarVideo ref={mediaStream} />
      ) : (
        <div className="flex flex-col justify-center w-full items-center">
        <NavBar/>
        <AvatarConfig config={config} onConfigChange={setConfig} />
        </div>
      )}
    </div>

    {/* Controls - always visible */}
    <div className="flex-shrink-0 flex flex-col gap-2 items-center justify-center p-2 sm:p-4 border-t border-slate-700">
      {sessionState === StreamingAvatarSessionState.CONNECTED ? (
        <AvatarControls />
      ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Button className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2" onClick={() => startSessionV2(true)}>
            Start Voice
          </Button>
          <Button className="w-full sm:w-auto text-xs sm:text-sm px-3 py-2" onClick={() => startSessionV2(false)}>
            Start Text
          </Button>
        </div>
      ) : (
        <LoadingIcon />
      )}
    </div>
  </div>

  {/* Right: Message History */}
  {sessionState === StreamingAvatarSessionState.CONNECTED && (
    <div className="p-2 flex-[1] flex flex-col bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden h-[40vh] xl:h-auto">
      <MessageHistory />
    </div>
  )}
</div>







  );
}

export default function InteractiveAvatarWrapper() {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}
