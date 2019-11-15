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

  this.play = (note, vel) => {
    const pad = note % 12
    const oct = Math.floor(note / 12)
    const notes = ['C', 'C#', 'D', 'D#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const code = `${notes[pad]}${oct}`
    this.voice.triggerAttack(code)
  }

  this.check = () => {
    if (Object.keys(this.buffers).length > 0) {
      this.isReady = true
      client.rack.update()
    }
  }
}
