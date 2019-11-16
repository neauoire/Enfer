'use strict'

/* global DrumKit */
/* global SynthKit */

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
    this.add(new DrumKit('dmx'))
    this.add(new DrumKit('dnb'))
    this.add(new DrumKit('dark'))
    this.add(new DrumKit('deep'))
    this.add(new DrumKit('tech'))
    this.add(new DrumKit('modular'))
    this.add(new DrumKit('gabber'))
    this.add(new DrumKit('bergh'))

    this.add(new SynthKit('tr808'))
    this.add(new SynthKit('tr909'))
    this.add(new SynthKit('dmx'))
    this.add(new SynthKit('dnb'))
    this.add(new SynthKit('dark'))
    this.add(new SynthKit('deep'))

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
      kit.start()
      kit.connect(client.mixer)
    }
    client.mixer.start()
    client.io.start()
  }

  this.update = () => {
    for (const kit of this.kits) {
      if (!kit.isReady) {
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
    this.kits[ch].play(pad, vel)
  }
}
