declare module 'qrcode' {
  interface ToDataURLOptions {
    errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high'
    type?: string
    rendererOpts?: Record<string, any>
    width?: number
    margin?: number
    scale?: number
    color?: {
      dark?: string
      light?: string
    }
  }

  function toDataURL(text: string, options?: ToDataURLOptions): Promise<string>

  namespace QRCode {
    function toDataURL(text: string, options?: ToDataURLOptions): Promise<string>
  }

  export = QRCode
}
