export type StepType = {
  title: string;
  description: string;
  component: React.ReactElement;
};

export type LayoutType = {
  variation: string | undefined;
  body: ColorPreferenceType;
  footer: ColorPreferenceType;
  banner: { upload: 'yes' | 'no'; imgUrl: string | null };
}

export interface CallToAction {
  id: number;
  label: string;
  callToAction: string;
  setCallToAction: (callToAction: string) => void;
  url: string;
  setUrl: (url: string) => void;
  disabled?: boolean;
}

export type OptimizerFormFieldType = {
  type: string;
  key: string | number;
  label: string;
  value: any;
  image?: File | Blob | String | null;
  imageWidth?: number;
  comments?: string | null;
  ctaType?: string;
  ctaAction?: string;
  ctaCustomLabel?: string | null;
  attachmentLink?: string | null;
  imageActionUrl?: string | null;
};

type CTAActionType = {
  ctaType: string;
  ctaAction: string;
  ctaCustomLabel?: string | null;
};

export type EmailContent = {
  message: string;
  image: File | Blob | string | null;
  imgUrl: string;
};

export type ColorPreferenceType = {
  colorPreference: 'yes' | 'no';
  preferredColor: string;
};

export type ExportHTMLType = {
  subject: string;
  htmlContent: string;
};

export type FooterContentType = {
  text: string;
  image: File | Blob | string | null;
};

//  Speaker Page context values

type SpeakerType = {
  topic: string;
  speakerName: string;
  speakerTitle: string;
};

export type StandardFormValuesType = {
  emailType: string;
  recipient: string;
  brandName: string;
  therapyArea: string;
  contents: Array<EmailContent>;
  details: string;
  background: string;
  ctas: Array<CTAActionType>;
  goal: string;
  toneOfVoice: string;
  wordsLength: string;
  footers: Array<FooterContentType>;
  unsubscribeLink?: string;
  privacyPolicy?: string
};

export type VideoFormValuesType = {
  aboutVideo: string;
  speaker: string;
  bodyText1: string;
  bodyText2: string;
  videoType: 'url' | 'uploaded';
  videoURL: string;
  videoThumbnail: string;
  ctas: Array<CTAActionType>;
  toneOfVoice: string;
  wordsLength: string;
  footers: Array<FooterContentType>;
  contents?: Array<EmailContent>;
  unsubscribeLink?: string;
  privacyPolicy?: string
};

export type SpeakerFormValuesType = {
  eventType: string;
  attachment: string | null;
  attachmentLink: string | null;
  bodyText1: string;
  bodyText2: string;
  speakers: Array<SpeakerType>;
  ctas: Array<CTAActionType>;
  toneOfVoice: string;
  wordsLength: string;
  footers: Array<FooterContentType>;
  contents?: Array<EmailContent>;
  unsubscribeLink?: string;
  privacyPolicy?: string
};

export type TemplatContextType = {
  formData:
  | StandardFormValuesType
  | VideoFormValuesType
  | SpeakerFormValuesType;
  optimizer: { formData: Array<OptimizerFormFieldType>; emailContent: string };
  layout: LayoutType;
  export: ExportHTMLType;
  currentId: number;
};

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

export type PriceType = {
  id: number;
  name: string;
  billing: string;
  price: number;
  discountedPrice: number;
  allTemplates: boolean;
  videoHosting: boolean;
  exportToPdf: boolean;
  exportToHtml: boolean;
  index: number;
  trash: boolean;
  popular:boolean;
  stripe_link:string;
};

export type QuotationType = {
  id: number;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  contactPerson: string;
  pricing_id: number;
  quoteNumber: string;
  user_id: number;
  paidDate: string | Date | null;
  Pricing: PriceType;
  createdAt: string | Date | null;
};

export type WorkStatementType = {
  id: number;
  companyEmail: string;
  pricing_id: number;
  user_id: number;
  paidDate: string | Date | null;
  sendDate: string | Date | null;
  Pricing: PriceType;
  requestFile?: Array<FileUpload>;
  uploadFile?: Array<FileUpload>;
  needAServices?: boolean;
  needAWorkStatement?: boolean;
  needToSign?: boolean;
  requestNumber: string;
  comment?: string;
  progress?: string;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
};
export type FileUpload = {
  contentType: string;
  pathname: string;
  url: string
}

export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  brand: string;
  therapyArea: string;
  jobTitle: string;
  jobFunction: string;
  country: string;
  veevaFlag: boolean;
  stripeCustomerId: string | null;
  role: string | null;
  isVerified: boolean | null;
  verificationToken: string | null;
  resetToken: string | null;
  resetTokenExpires: string | null;
  createdAt: string;
  updatedAt: string;
}

