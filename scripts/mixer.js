'use strict'

/* global Tone */

function Mixer (client) {
  this.inputs = [
    new Tone.AudioNode(),
    new Tone.AudioNode(),
    new Tone.AudioNode(),
    new Tone.AudioNode()
  ]

  this.reverb = new Tone.Reverb()

  this.install = () => {
    this.reverb.decay = 10.0
  }

  this.start = () => {
    this.inputs[0].toMaster()
    this.inputs[0].connect(this.reverb)
    this.reverb.generate()
    this.reverb.toMaster()
  }
}
