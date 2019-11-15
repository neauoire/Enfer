'use strict'

/* global Tone */
/* global client */

function SynthKit (name) {
  this.name = name
  this.isReady = false
  this.parts = ['sampler']
  this.buffers = {}

  this.voice = new Tone.Sampler()

  this.install = (host) => {
    for (const id in this.parts) {
      this.load(id, this.parts[id])
    }
  }

  this.start = () => {
    for (const part in this.buffers) {
      this.voice.add('C3', this.buffers[part])
    }
  }

  this.connect = (mixer) => {
    this.voice.connect(mixer.inputs[3])
  }

  this.load = (pad, part) => {
    const url = `./media/${name}/${part}.wav`
    var buffer = new Tone.Buffer(url, () => {
      this.buffers[part] = buffer.get()
      this.check()
    })
  }

  this.play = (pad, vel) => {
    const notes = ['C2', 'C#2', 'D2', 'D#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3']
    this.voice.triggerAttack(notes[pad % notes.length])
  }

  this.check = () => {
    if (Object.keys(this.buffers).length > 0) {
      this.isReady = true
      client.rack.update()
    }
  }
}
