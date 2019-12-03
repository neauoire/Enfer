'use strict'

/* global Kit */

function Rack (client) {
  this.el = document.createElement('div')
  this.el.id = 'rack'
  this.isReady = false

  this.kits = []

  this.install = (host) => {
    host.appendChild(this.el)

    // Drum Kits
    this.add(new Kit('tr808'))
    this.add(new Kit('tr909'))
    this.add(new Kit('dmx'))
    this.add(new Kit('dnb'))
    this.add(new Kit('dark'))
    this.add(new Kit('deep'))
    this.add(new Kit('tech'))
    this.add(new Kit('modular'))
    this.add(new Kit('gabber'))
    this.add(new Kit('bergh'))
    // this.add(new Kit('vermona'))
    // this.add(new Kit('commodore'))
    // this.add(new Kit('dmg'))

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
