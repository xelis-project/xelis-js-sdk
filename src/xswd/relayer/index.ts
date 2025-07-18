import { App } from './app'

export type RelayerEncryptionMode = null | "aes" | "chacha20poly1305"

export interface RelayerProps {
    url: string
    encryption_mode: RelayerEncryptionMode
    parent: HTMLElement
}

class Relayer {
    ws: WebSocket
    app: App;
    props: RelayerProps
    message_timeout?: number

    constructor(props: RelayerProps) {
        this.props = props
        this.app = new App(this);

        this.ws = new WebSocket(this.props.url)
        this.ws.addEventListener(`open`, this.onOpen)
        this.ws.addEventListener(`message`, this.onMessage)
        this.ws.addEventListener(`error`, this.onError)
        this.ws.addEventListener(`close`, this.onClose)
    }

    close() {
        this.ws.close()
        this.app.element.remove()
    }

    onOpen = (e: Event) => {
        this.message_timeout = window.setTimeout(() => {
            this.app.setError("timeout occured (did not receive any message)")
        }, 3000)
    }

    onMessage = (e: MessageEvent) => {
        window.clearTimeout(this.message_timeout)
        try {
            console.log(e)
            const data = JSON.parse(e.data)
            if (data.channel_id) {
                this.app.setQRCode(data.channel_id)
            } else {
                this.app.setError("channel id not found")
            }
        } catch (e) {
            this.app.setError("invalid data format")
        }
    }

    onError = (e: Event) => {
        this.app.setError("connection failed");
    }

    onClose = (e: CloseEvent) => {
        this.app.setError("connection closed")
    }
}

export default Relayer
