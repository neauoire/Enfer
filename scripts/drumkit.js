'use strict'

/* global Tone */
/* global client */

function DrumKit (name) {
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
    this.voices[0].connect(mixer.inputs[0])
    this.voices[1].connect(mixer.inputs[1])
    this.voices[2].connect(mixer.inputs[2])
    this.voices[3].connect(mixer.inputs[3])
  }

  this.load = (pad, part) => {
    const url = `./media/${name}/${part}.wav`
    var buffer = new Tone.Buffer(url, () => {
      this.buffers[part] = buffer.get()
      this.check()
    })
  }

  this.play = (note, vel) => {
    if(vel === 0){ return }
    const pad = note % 16
    const buffer = this.buffers[this.parts[pad]]
    if (!buffer) { console.warn(name, 'Unknown pad: ' + this.parts[pad]); return }
    const voice = this.voices[Math.floor(pad / 4)]
    const volume = 36 - ((vel / 127) * 36)
    voice.buffer = buffer
    voice.volume.value = -volume
    voice.start()
  }

  this.check = () => {
    if (Object.keys(this.buffers).length === 16) {
      this.isReady = true
      client.rack.update()
    }
  }
}
