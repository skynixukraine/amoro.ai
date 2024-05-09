import {
  StandardFormValuesType,
  SpeakerFormValuesType,
  VideoFormValuesType,
  LayoutType
} from '../types';

export const standardFormDefaultValues: StandardFormValuesType = {
  emailType: '',
  recipient: '',
  brandName: '',
  therapyArea: '',
  contents: [{ message: '', image: null, imgUrl: '' }],
  details: '',
  background: '',
  ctas: [{ ctaType: '', ctaAction: '', ctaCustomLabel: null }],
  goal: '',
  toneOfVoice: '',
  wordsLength: '',
  footers: [{ text: '', image: null }],
  privacyPolicy: '',
  unsubscribeLink:''
};

export const videoFormDefaultValues: VideoFormValuesType = {
  aboutVideo: '',
  speaker: '',
  bodyText1: '',
  bodyText2: '',
  videoType: 'url',
  videoURL: '',
  videoThumbnail: '',
  ctas: [{ ctaType: '', ctaAction: '', ctaCustomLabel: null }],
  toneOfVoice: '',
  wordsLength: '',
  footers: [{ text: '', image: null }],
  privacyPolicy: '',
  unsubscribeLink:''
};

export const speakerFormDefaultValues: SpeakerFormValuesType = {
  eventType: '',
  bodyText1: '',
  attachment: '',
  attachmentLink: '',
  bodyText2: '',
  ctas: [{ ctaType: '', ctaAction: '', ctaCustomLabel: null }],
  speakers: [{ topic: '', speakerName: '', speakerTitle: '' }],
  toneOfVoice: '',
  wordsLength: '',
  footers: [{ text: '', image: null }],
};

export const layoutValues: LayoutType = {
  variation: 'origin',
  body: { colorPreference: 'no', preferredColor: '#000' },
  footer: { colorPreference: 'no', preferredColor: '#000' },
  banner: { upload: 'no', imgUrl: null },
}