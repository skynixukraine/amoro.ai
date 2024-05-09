export interface CallToAction {
  id: number
  label: string
  callToAction: string
  setCallToAction: (callToAction: string) => void
  url: string
  setUrl: (url: string) => void
  disabled?: boolean
}
