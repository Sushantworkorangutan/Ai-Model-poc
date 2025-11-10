import { ElevenLabsModel, VoiceEmotion } from "@heygen/streaming-avatar";

// choose model based on latency vs. quality
export function getVoiceModel(lang: string) {
  // For English or when speed matters
  if (lang === "en") return ElevenLabsModel.eleven_flash_v2_5;
  // For all other languages — better accent fidelity
  return ElevenLabsModel.eleven_multilingual_v2;
}

// emotion / rate / style tuning by language
export function getVoiceAccentSettings(lang: string) {
  const accents: Record<
    string,
    { emotion: VoiceEmotion; rate: number; style: number }
  > = {
    it: { emotion: VoiceEmotion.SOOTHING, rate: 0.95, style: 0.8 },
    de: { emotion: VoiceEmotion.SERIOUS, rate: 0.95, style: 0.7 },
    fr: { emotion: VoiceEmotion.FRIENDLY, rate: 1.0, style: 0.7 },
    es: { emotion: VoiceEmotion.EXCITED, rate: 1.05, style: 0.8 },
    default: { emotion: VoiceEmotion.FRIENDLY, rate: 1.0, style: 0.6 },
  };
  return accents[lang] || accents.default;
}
