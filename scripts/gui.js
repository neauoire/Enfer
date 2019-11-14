'use strict'

function Gui (client) {
  this.el = document.createElement('div')
  this.el.id = 'gui'
  this.pads = []

  this.install = (host) => {
    for (let id = 0; id < 16; id++) {
      const pad = document.createElement('canvas')
      pad.width = 100
      pad.height = 80
      pad.id = `pad_${client.rack.parts[id]}`
      pad.className = `pad ${client.rack.parts[id]}`
      this.pads.push(pad)
      this.el.appendChild(pad)
    }

    host.appendChild(this.el)
  }

  this.debug = (ch, id, color) => {
    if (!this.pads[id]) { console.warn(ch, id); return }
    const context = this.pads[id].getContext('2d')
    const x = (ch % 4) * 6
    const y = Math.floor(ch / 4) * 6
    context.fillStyle = color
    context.fillRect(x + 10, y + 10, 5, 5)
  }
}
