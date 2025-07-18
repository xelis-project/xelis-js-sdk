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
            <div>XSWD Relayer</div>
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
        this.errElement.innerHTML = `error: ${msg}`
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

        QRCode.toCanvas(canvas, qrCodeData);

        this.contentElement.appendChild(this.qrCodeElement)
    }
}