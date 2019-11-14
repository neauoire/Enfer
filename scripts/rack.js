'use strict'

function Rack (client) {
  this.el = document.createElement('div')
  this.el.id = 'rack'
  this.kits = []
  this.pads = []

  this.install = (host) => {
    host.appendChild(this.el)

    // Drum Kits
    this.add('tr808')
    this.add('tr909')
    this.add('dmx')
    this.add('dnb')
    this.add('dark')
    this.add('deep')
    this.add('tech')
    this.add('modular')
    this.add('gabber')
    this.add('bergh')

    // Sampler Kits

    for (const kit of this.kits) {
      kit.install(this.el)
    }
  }

  this.add = (name) => {
    console.log('Rack', 'Adding ' + name)
    const kit = new DrumKit(client, this, this.kits.length, name)
    this.kits.push(kit)
  }

  this.start = () => {

  }

  this.play = (ch, pad, vel = 127) => {
    if (!this.kits[ch]) { console.warn('Rack', 'Missing kit ', ch); return }
    this.kits[ch].play(pad % 16, vel)
  }
}
