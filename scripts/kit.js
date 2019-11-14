'use strict'

/* global Tone */

function DrumKit (client, rack, id, name) {
  this.parts = ['kick', 'kick-up', 'kick-down', 'tom', 'snare', 'snare-up', 'snare-down', 'clap', 'hat', 'hat-open', 'hat-shut', 'cymb', 'fx1', 'fx2', 'fx3', 'fx4']
  this.buffers = {}

  this.voices = [
    new Tone.Player(),
    new Tone.Player(),
    new Tone.Player(),
    new Tone.Player()
  ]

  this.install = (host) => {
    console.log(name, 'Loading..')
    for (const id in this.parts) {
      this.load(id, this.parts[id])
    }
    for (const voice of this.voices) {
      voice.toMaster()
    }
  }

  this.start = () => {
  }

  this.load = (pad, part) => {
    const url = `./media/${name}/${part}.wav`
    client.gui.debug(id, pad, 'red')
    var buffer = new Tone.Buffer(url, () => {
      console.log(name, part, 'length:', buffer.length)
      this.buffers[part] = buffer.get()
      client.gui.debug(id, pad, 'green')
    })
  }

  this.play = (pad, vel) => {
    const buffer = this.buffers[this.parts[pad]]
    if (!buffer) { console.warn(name, 'Unknown pad: ' + this.parts[pad]); return }
    const voice = this.voices[Math.floor(pad / 4)]
    voice.buffer = buffer
    voice.start()
  }

  this.check = () => {
    console.log(name, `${Object.keys(this.buffers).length}/16`)
  }
}
