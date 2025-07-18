import Relayer from '../../index'
import '../../index.css'

document.getElementById(`btn_open_relayer`)?.addEventListener(`click`, () => {
  const relayer = new Relayer({
    parent: document.getElementById(`app`)!,
    url: "ws://localhost:8080/ws",
    encryption_mode: "aes"
  })
})