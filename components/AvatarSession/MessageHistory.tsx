import React, { useEffect, useRef } from "react";
import { useMessageHistory, MessageSender, useVoiceChat } from "../logic";
import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";
import { useStreamingAvatarContext } from "../logic/context";

export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
  const { isVoiceChatLoading, isVoiceChatActive } = useVoiceChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { startQuiz } = useStreamingAvatarContext();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <h1 className="m-2 sm:text-lg text-sm sm:m-4">Messages</h1>
      {/* Scrollable message area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-2">
      {messages.map((m) => (
  <div
    key={m.id}
    className={`flex flex-col max-w-[80%] ${
      m.sender === MessageSender.CLIENT ? "items-end self-end" : "items-start self-start"
    }`}
  >
    <div
      className={`rounded-2xl px-3 py-2 shadow-md 
        ${
          m.sender === MessageSender.CLIENT
            ? "bg-[#ef3c52]/80 text-white" // client message (dark green with transparency)
            : "bg-white/80 text-black"    // avatar message (semi-transparent white)
        }`}
    >
      <p className="text-[10px] sm:text-xs font-semibold opacity-70 mb-1">
        {m.sender === MessageSender.AVATAR ? "Avatar" : "You"}
      </p>
      <p className="text-xs sm:text-sm break-words">{m.content}</p>
    </div>
  </div>
))}

      </div>

      {/* Input box */}
      <div className="flex-shrink-0 p-2 border-t border-slate-700 bg-white dark:bg-slate-800">
        {isVoiceChatActive ? (
          <AudioInput />
        ) : (
          <TextInput startQuiz={startQuiz} />
        )}
      </div>
    </div>
  );
};
