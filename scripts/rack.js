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
    this.add(new Kit('tr808')) // saw-acid
    this.add(new Kit('tr909')) // square-acid
    this.add(new Kit('dmx')) // FM square
    this.add(new Kit('dnb')) // Solid Bass(DX100)
    this.add(new Kit('dark')) // Odyssey(Arp B)
    this.add(new Kit('deep')) // Solina(Cello)
    this.add(new Kit('tech')) // Attack Lead(Aelita)
    this.add(new Kit('modular')) // Good Vibes(DX100)
    this.add(new Kit('gabber')) // Kulak Decay(Altair 231)
    this.add(new Kit('bergh')) // Tiny Rave(DX100)
    this.add(new Kit('vermona')) // Funk Bass(Aelita)
    this.add(new Kit('commodore')) // Troika Pulse(Altair 231)
    this.add(new Kit('dmg')) // Comecon(Altair 231)

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
