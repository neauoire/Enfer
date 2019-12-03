'use strict'

/* global Tone */
/* global client */

function Kit (name) {
  this.name = name
  this.isReady = false
  this.parts = ['kick', 'kick-up', 'kick-down', 'tom', 'snare', 'snare-up', 'snare-down', 'clap', 'hat', 'hat-open', 'hat-shut', 'cymb', 'fx1', 'fx2', 'fx3', 'fx4', 'synth-C2', 'synth-C4', 'synth-C6']
  this.buffers = {}
  this.offset = 0
  this.length = 0

  this.voices = [
    new Tone.Player(),
    new Tone.Player(),
    new Tone.Player(),
    new Tone.Player(),
    new Tone.Sampler()
  ]

  this.install = (host) => {
    console.log(name, 'Loading..')
    for (const id in this.parts) {
      this.load(id, this.parts[id])
    }
  }

  this.start = () => {
    this.voices[4].add('C2', this.buffers['synth-C2'])
    this.voices[4].add('C4', this.buffers['synth-C4'])
    this.voices[4].add('C6', this.buffers['synth-C6'])
  }

  this.connect = (mixer) => {
    this.voices[0].connect(mixer.inputs[0])
    this.voices[1].connect(mixer.inputs[1])
    this.voices[2].connect(mixer.inputs[2])
    this.voices[3].connect(mixer.inputs[3])
    this.voices[4].connect(mixer.inputs[3])
  }

  this.load = (pad, part) => {
    const url = `./media/${name}/${part}.wav`
    var buffer = new Tone.Buffer(url, () => {
      this.buffers[part] = buffer.get()
      this.check()
    })
  }

  this.play = (note, vel) => {
    if (vel === 0) { return }
    if (note < 36) {
      this.playDrum(note, vel)
    } else {
      this.playPad(note, vel)
    }
  }

  this.playDrum = (note, vel) => {
    const pad = note % 16
    const buffer = this.buffers[this.parts[pad]]
    if (!buffer) { console.warn(name, 'Unknown pad: ' + this.parts[pad]); return }
    const voice = this.voices[Math.floor(pad / 4)]
    const volume = 36 - ((vel / 127) * 36)
    voice.buffer = buffer
    voice.volume.value = -volume
    voice.start(undefined, this.offset)
  }

  this.playPad = (note, vel) => {
    const pad = note % 12
    const oct = Math.floor(note / 12) - 1
    const notes = ['C', 'C#', 'D', 'D#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const code = `${notes[pad]}${oct}`
    this.voices[4].triggerAttackRelease(code, this.length, undefined, vel / 127)
  }

  this.check = () => {
    if (Object.keys(this.buffers).length === 17) {
      this.isReady = true
      client.rack.update()
    }
  }
}
