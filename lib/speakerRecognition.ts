import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import passphrase_files from "../public/test.mp3";
import identify_file from "../public/identify.mp3";
var fs = require("fs");

const speakerRecognition = () => {
  // Note: Change the locale if desired.
  const profile_locale = "zh-CN";

  /* Note: passphrase_files and verify_file should contain paths to audio files that contain \"My voice is my passport, verify me.\"
You can obtain these files from:
https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/fa6428a0837779cbeae172688e0286625e340942/quickstart/javascript/node/speaker-recognition/verification
*/
  // const passphrase_files = ["test.mp3"];
  // const verify_file = "myVoiceIsMyPassportVerifyMe04.wav";
  /* Note: identify_file should contain a path to an audio file that uses the same voice as the other files, but contains different speech. You can obtain this file from:
https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/fa6428a0837779cbeae172688e0286625e340942/quickstart/javascript/node/speaker-recognition/identification
*/
  // const identify_file = "aboutSpeechSdk.wav";

  const subscription_key = process.env.SPEECH_KEY;
  const region = process.env.SPEECH_REGION;
  const ticks_per_second = 10000000;

  async function main() {
    const speech_config = sdk.SpeechConfig.fromSubscription(
      subscription_key,
      region
    );
    console.log(speech_config);
    const client = new sdk.VoiceProfileClient(speech_config);

    // await textDependentVerification(client, speech_config);
    await textIndependentVerification(client, speech_config);
    // await textIndependentIdentification(client, speech_config);
    console.log("End of quickstart.");
  }
  main();

  const getAudioConfigFromFile = (file) => {
    // 要辨識 bot自己的聲音
    // return sdk.AudioConfig.fromDefaultSpeakerOutput();
    return sdk.AudioConfig.fromWavFileInput(fs.readFileSync(file));
  };

  const textDependentVerification = async (
    client: sdk.VoiceProfileClient,
    speech_config: sdk.SpeechConfig
  ) => {
    console.log("Text Dependent Verification:\n");
    var profile = null;
    try {
      const type = sdk.VoiceProfileType.TextDependentVerification;
      // Create the profile.
      profile = await client.createProfileAsync(type, profile_locale);
      console.log("Created profile ID: " + profile.profileId);
      // Get the activation phrases
      await client.getActivationPhrasesAsync(type, profile_locale);
      await addEnrollmentsToTextDependentProfile(
        client,
        profile,
        passphrase_files
      );
      const audio_config = getAudioConfigFromFile(verify_file);
      const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
      await speakerVerify(profile, recognizer);
    } catch (error) {
      console.log("Error:\n" + error);
    } finally {
      if (profile !== null) {
        console.log("Deleting profile ID: " + profile.profileId);
        const deleteResult = await client.deleteProfileAsync(profile);
      }
    }
  };

  async function addEnrollmentsToTextDependentProfile(
    client: sdk.VoiceProfileClient,
    profile,
    audio_files
  ) {
    try {
      for (const file of audio_files) {
        console.log("Adding enrollment to text dependent profile...");
        const audio_config = getAudioConfigFromFile(file);
        const result = await client.enrollProfileAsync(profile, audio_config);
        if (result.reason === sdk.ResultReason.Canceled) {
          throw JSON.stringify(
            sdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)
          );
        } else {
          console.log(
            "Remaining enrollments needed: " +
              result.privDetails["remainingEnrollmentsCount"] +
              "."
          );
        }
      }
      console.log("Enrollment completed.\n");
    } catch (error) {
      console.log("Error adding enrollments: " + error);
    }
  }

  async function speakerVerify(profile: sdk.VoiceProfile, recognizer) {
    try {
      const model = sdk.SpeakerVerificationModel.fromProfile(profile);
      const result = await recognizer.recognizeOnceAsync(model);
      console.log(
        "Verified voice profile for speaker: " +
          result.profileId +
          ". Score is: " +
          result.score +
          ".\n"
      );
    } catch (error) {
      console.log("Error verifying speaker: " + error);
    }
  }

  async function textIndependentVerification(
    client: sdk.VoiceProfileClient,
    speech_config: sdk.SpeechConfig
  ) {
    console.log("Text Independent Verification:\n");
    let profile = null;
    try {
      const type = sdk.VoiceProfileType.TextIndependentVerification;
      // Create the profile.
      profile = await client.createProfileAsync(type, profile_locale);
      console.log("Created profile ID: " + profile.profileId);
      // Get the activation phrases
      await client.getActivationPhrasesAsync(type, profile_locale);
      await addEnrollmentsToTextIndependentProfile(client, profile, [
        identify_file,
      ]);
      /*
    identify_file => array 要辨識的語音
    passphrase_files => 20秒語音
    */

      const audio_config = getAudioConfigFromFile(passphrase_files[0]);
      const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
      await speakerVerify(profile, recognizer);
    } catch (error) {
      console.log("Error:\n" + error);
    } finally {
      if (profile !== null) {
        console.log("Deleting profile ID: " + profile.profileId);
        const deleteResult = await client.deleteProfileAsync(profile);
      }
    }
  }

  async function addEnrollmentsToTextIndependentProfile(
    client: sdk.VoiceProfileClient,
    profile: sdk.VoiceProfile,
    audio_files
  ) {
    try {
      for (const file of audio_files) {
        console.log("Adding enrollment to text independent profile...");
        const audio_config = getAudioConfigFromFile(file);
        const result = await client.enrollProfileAsync(profile, audio_config);
        if (result.reason === sdk.ResultReason.Canceled) {
          throw JSON.stringify(
            sdk.VoiceProfileEnrollmentCancellationDetails.fromResult(result)
          );
        } else {
          console.log(
            "Remaining audio time needed: " +
              result.privDetails["remainingEnrollmentsSpeechLength"] /
                ticks_per_second +
              " seconds."
          );
        }
      }
      console.log("Enrollment completed.\n");
    } catch (error) {
      console.log("Error adding enrollments: " + error);
    }
  }

  async function textIndependentIdentification(client, speech_config) {
    console.log("Text Independent Identification:\n");
    var profile = null;
    try {
      const type = sdk.VoiceProfileType.TextIndependentIdentification;
      // Create the profile.
      profile = await client.createProfileAsync(type, profile_locale);
      console.log("Created profile ID: " + profile.profileId);
      // Get the activation phrases
      await client.getActivationPhrasesAsync(type, profile_locale);
      await addEnrollmentsToTextIndependentProfile(client, profile, [
        identify_file,
      ]);
      const audio_config = getAudioConfigFromFile(passphrase_files[0]);
      const recognizer = new sdk.SpeakerRecognizer(speech_config, audio_config);
      await speakerIdentify(profile, recognizer);
    } catch (error) {
      console.log("Error:\n" + error);
    } finally {
      if (profile !== null) {
        console.log("Deleting profile ID: " + profile.profileId);
        const deleteResult = await client.deleteProfileAsync(profile);
      }
    }
  }

  async function speakerIdentify(profile: sdk.VoiceProfile, recognizer) {
    try {
      const model = sdk.SpeakerIdentificationModel.fromProfiles([profile]);
      const result = await recognizer.recognizeOnceAsync(model);
      console.log(
        "The most similar voice profile is: " +
          result.profileId +
          " with similarity score: " +
          result.score +
          ".\n"
      );
    } catch (error) {
      console.log("Error identifying speaker: " + error);
    }
  }
};

// ----------------------------------------------------------------
// const speakerRecognition = async () => {
//   let speechConfig = sdk.SpeechConfig.fromSubscription(
//     process.env.SPEECH_KEY,
//     process.env.SPEECH_REGION
//   );

//   speechConfig.setProperty(
//     sdk.PropertyId.SpeechServiceConnection_TranslationVoice,
//     LOCAL
//   );
//   let client = new sdk.VoiceProfileClient(speechConfig);

//   try {
//     const profile = await client.createProfileAsync(
//       sdk.VoiceProfileType.TextIndependentIdentification,
//       LOCAL
//     );
//     console.log(profile);
//     console.log("Profile created ProfileId: ", profile.profileId);

//     let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
//     let result = await client.enrollProfileAsync(profile, audioConfig);
//     console.log(
//       "(Enrollment result) Reason: " + sdk.ResultReason[result.reason]
//     );
//     console.log(result);
//   } catch (err) {
//     console.log(err);
//   }
// };

export default speakerRecognition;
