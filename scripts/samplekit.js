'use strict'

/* global Tone */
/* global client */

function SampleKit (name) {
  this.name = name
  this.isReady = false
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
  }

  this.start = () => {
  }

  this.connect = (mixer) => {
    console.log(name, 'connecting..')
    this.voices[0].connect(this.reverb)
    this.voices[1].connect(this.reverb)
    this.voices[2].connect(this.reverb)
    this.voices[3].connect(this.reverb)
    this.reverb.generate()
    this.reverb.wet.value = 0.25
    this.freeverb.wet.value = 0.25
    this.reverb.connect(this.freeverb)
    this.freeverb.toMaster()
  }

  this.load = (pad, part) => {
    const url = `./media/${name}/${part}.wav`
    var buffer = new Tone.Buffer(url, () => {
      this.buffers[part] = buffer.get()
      this.check()
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
    if (Object.keys(this.buffers).length === 16) {
      this.isReady = true
      client.rack.update()
    }
  }
}
