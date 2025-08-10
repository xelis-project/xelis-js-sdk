import QRCode from 'qrcode'
import Relayer, { RelayerEncryptionMode } from './index'

interface RelayerAppData {
    inner: any
    relayer: string
    encryption_mode: RelayerEncryptionMode
}

export class App {
    relayer: Relayer

    element: HTMLDivElement
    contentElement: HTMLDivElement
    qrCodeElement: HTMLDivElement
    loadingElement: HTMLDivElement
    errElement: HTMLDivElement

    constructor(relayer: Relayer) {
        this.relayer = relayer

        this.element = document.createElement(`div`)
        this.element.classList.add(`xelis-xswd-relayer`)

        this.contentElement = document.createElement(`div`)
        this.contentElement.classList.add(`xelis-xswd-relayer-content`)
        this.element.appendChild(this.contentElement)

        this.loadingElement = document.createElement(`div`)
        this.loadingElement.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="currentColor" stroke-width="3.55556" stroke-linecap="round"/>
            </svg>
        `
        this.loadingElement.classList.add(`xelis-xswd-relayer-loading`)

        this.errElement = document.createElement(`div`)
        this.errElement.classList.add(`xelis-xswd-relayer-error`)

        this.qrCodeElement = document.createElement(`div`)
        this.qrCodeElement.classList.add(`xelis-xswd-relayer-qrcode`)
        this.qrCodeElement.innerHTML = `
            <div class="xelis-xswd-relayer-scan-logo">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4,4h6v6H4V4M20,4v6H14V4h6M14,15h2V13H14V11h2v2h2V11h2v2H18v2h2v3H18v2H16V18H13v2H11V16h3V15m2,0v3h2V15H16M4,20V14h6v6H4M6,6V8H8V6H6M16,6V8h2V6H16M6,16v2H8V16H6M4,11H6v2H4V11m5,0h4v4H11V13H9V11m2-5h2v4H11V6M2,2V6H0V2A2,2,0,0,1,2,0H6V2H2M22,0a2,2,0,0,1,2,2V6H22V2H18V0h4M2,18v4H6v2H2a2,2,0,0,1-2-2V18H2m20,4V18h2v4a2,2,0,0,1-2,2H18V22Z"/>
                </svg>
            </div>
            <div class="xelis-xswd-relayer-logo-wrap">
                <div class="xelis-xswd-relayer-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 778 743" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M388.909 742.872L777.817 353.964L424.056 0.202599L478.809 132.737L700.036 353.964L388.909 665.091L77.7817 353.964L299.507 129.121L353.964 0L0 353.964L388.909 742.872Z" />
                        <path d="M388.909 665.091L353.964 0L299.507 129.121L388.909 665.091Z" />
                        <path d="M424.056 0.202599L388.909 665.091L478.809 132.737L424.056 0.202599Z" />
                    </svg>
                </div>
            </div>
            <div class="xelis-xswd-relayer-title">XSWD Relayer</div>
            <canvas></canvas>
        `

        this.element.addEventListener(`click`, (e) => {
            // close the app if clicking outside
            if (this.element.isEqualNode(e.target as Node)) {
                this.relayer.close();
            }
        })

        this.relayer.props.parent.appendChild(this.element)
        this.setLoading()
    }

    clear() {
        this.loadingElement.remove()
        this.errElement.remove()
        this.qrCodeElement.remove()
    }

    setError(msg: string) {
        this.clear()
        this.errElement.innerHTML = `
            <div class="xelis-xswd-relayer-error-text">error: ${msg}</div>
        `
        this.contentElement.appendChild(this.errElement)
    }

    setLoading() {
        this.clear()
        this.contentElement.appendChild(this.loadingElement)
    }

    setQRCode(channelId: string) {
        this.clear()

        const canvas = this.qrCodeElement.querySelector(`canvas`)

        const qrCodeData = JSON.stringify({
            inner: {},
            channel_id: channelId,
            relayer: this.relayer.props.url,
            encryption_mode: this.relayer.props.encryption_mode
        } as RelayerAppData)

        QRCode.toCanvas(canvas, qrCodeData, { 
            color: { 
                dark: `#fff`, // dots
                light: `#000` // background
            }
        })

        this.contentElement.appendChild(this.qrCodeElement)
    }
}