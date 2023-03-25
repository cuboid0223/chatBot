import * as sdk from "microsoft-cognitiveservices-speech-sdk";
const DEFAULT_SPEECH_CONFIG = {
  language: "zh-CN",
  voiceName: "zh-CN-XiaoxiaoNeural",
};

const speak = (text: string, config = DEFAULT_SPEECH_CONFIG) => {
  if (typeof window === "undefined") return;

  let speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION
  );
  // Note: if only language is set, the default voice of that language is chosen.
  speechConfig.speechSynthesisLanguage = config.language; // For example, "de-DE"
  // The voice setting will overwrite the language setting.
  // The voice setting will not overwrite the voice element in input SSML.
  speechConfig.speechSynthesisVoiceName = config.voiceName;
  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  synthesizer.speakSsmlAsync(
    ` <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
        <voice name="zh-CN-XiaoxiaoNeural">
            <mstts:express-as style="gentle">
              ${text}
            </mstts:express-as>
        </voice>
    </speak>`,
    (result) => {
      if (result) {
        console.log("SynthesizingAudioCompleted result");
        console.log("synthesis finished for [" + text + "].\n");
        console.log(result.audioData);

        synthesizer.close();
      }
    },
    (error) => {
      console.log("err", error);
      synthesizer.close();
    }
  );

  // synthesizer.speakTextAsync(
  //   "I'm excited to try text-to-speech",
  //   (result) => {
  //     if (result) {
  //       if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
  //         console.log("SynthesizingAudioCompleted result");
  //       } else {
  //         console.error(
  //           "Speech synthesis canceled, " +
  //             result.errorDetails +
  //             "\nDid you set the speech resource key and region values?"
  //         );
  //       }
  //       synthesizer.close();
  //     }
  //   },
  //   (error) => {
  //     console.log("err", error);
  //     synthesizer.close();
  //   }
  // );
};

export default speak;
