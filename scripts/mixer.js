'use strict'

/* global Tone */
/* global Knob */

function Mixer (client) {
  this.el = document.createElement('div')
  this.el.id = 'mixer'

  this.inputs = [
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0)
  ]

  this.knobs = {}

  this.compressor = new Tone.Compressor()
  this.filter = new Tone.Filter(10000, 'lowpass')

  this.chorus = new Tone.Chorus()
  this.reverb = new Tone.Reverb()
  this.freeverb = new Tone.Freeverb({ roomSize: 0.85, dampening: 5000 })
  this.feedback = new Tone.FeedbackDelay()
  this.stereo = new Tone.StereoWidener()
  this.limiter = new Tone.Limiter(0)

  this.install = (host) => {
    this.knobs.compressor = new Knob('compressor')
    this.knobs.filter = new Knob('filter')
    this.knobs.chorus = new Knob('chorus')
    this.knobs.reverb = new Knob('reverb')
    this.knobs.feedback = new Knob('feedback')
    this.knobs.stereo = new Knob('stereo')

    this.reverb.decay = 10.0

    for (const id in this.knobs) {
      this.el.appendChild(this.knobs[id].el)
    }

    host.appendChild(this.el)
  }

  this.start = () => {
    console.log('Mixer', 'Start')
    this.inputs[0].connect(this.compressor)
    this.inputs[1].connect(this.compressor)

    this.compressor.connect(this.filter)
    this.filter.connect(this.stereo)

    this.inputs[2].connect(this.chorus)
    this.inputs[3].connect(this.chorus)

    this.chorus.wet.value = 0.15
    this.reverb.wet.value = 0.15
    this.freeverb.wet.value = 0.15
    this.feedback.wet.value = 0.15
    this.reverb.generate()

    this.chorus.connect(this.reverb)
    this.reverb.connect(this.freeverb)
    this.freeverb.connect(this.feedback)
    this.feedback.connect(this.stereo)

    this.stereo.connect(this.limiter)
    this.limiter.toMaster()

    this.update()
  }

  this.update = () => {
  }
}
