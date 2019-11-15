'use strict'

/* global DrumKit */

function Rack (client) {
  this.el = document.createElement('div')
  this.el.id = 'rack'
  this.isReady = false

  this.kits = []
  this.pads = []

  this.install = (host) => {
    host.appendChild(this.el)

    // Drum Kits
    this.add(new DrumKit('tr808'))
    this.add(new DrumKit('tr909'))
    // this.add(new DrumKit('dmx'))
    // this.add(new DrumKit('dnb'))
    // this.add(new DrumKit('dark'))
    // this.add(new DrumKit('deep'))
    // this.add(new DrumKit('tech'))
    // this.add(new DrumKit('modular'))
    // this.add(new DrumKit('gabber'))
    // this.add(new DrumKit('bergh'))

    // Sampler Kits

    for (const kit of this.kits) {
      kit.install(this.el)
    }
  }

  this.add = (kit) => {
    console.log('Rack', 'Adding ' + kit.name)
    this.kits.push(kit)
  }

  this.start = () => {
    console.log('Starting')

    for (const kit of this.kits) {
      kit.connect(client.mixer)
    }
    client.mixer.start()
  }

  this.update = () => {
    for (const kit of this.kits) {
      if (!kit.isReady) {
        console.warn('Waiting.. ', kit.name)
        return
      }
    }
    console.log('Loading complete.')
    this.isReady = true
    this.start()
  }

  this.play = (ch, pad, vel = 127) => {
    if (!this.isReady) { console.log('Rack', 'Still loading..'); return }
    if (!this.kits[ch]) { console.warn('Rack', 'Missing kit ', ch); return }
    this.kits[ch].play(pad % 16, vel)
  }
}
