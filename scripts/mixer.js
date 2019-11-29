'use strict'

/* global Tone */
/* global Knob */

function Mixer (client) {
  this.el = document.createElement('div')
  this.el.id = 'mixer'
  this.wrapper = document.createElement('div')

  this.inputs = [
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0)
  ]

  this.cheby = new Tone.Chebyshev(5)
  this.delay = new Tone.FeedbackDelay('6n', 0.5)

  this.eq = new Tone.EQ3(0, -5, 0)
  this.compressor = new Tone.Compressor(-15, 10)
  this.filterh = new Tone.Filter(10000, 'highpass')
  this.filterl = new Tone.Filter(10000, 'lowpass')

  this.chorus = new Tone.Chorus()
  this.revera = new Tone.Reverb({ decay: 10, preDelay: 0.01 })
  this.reverb = new Tone.Reverb({ decay: 20, preDelay: 0.01 })
  this.stereo = new Tone.StereoWidener()
  this.limiter = new Tone.Limiter(-20)

  this.knobs = {}

  this.knobs.offset = new Knob('offset', (v) => {
    for (const kit of client.rack.kits) {
      kit.offset = v
    }
  }, 0, 0.125)

  this.knobs.cheby = new Knob('shaper', (v) => { this.cheby.wet.value = v }, 0, 0.5)
  this.knobs.delay = new Knob('delay', (v) => { this.delay.wet.value = v }, 0, 1)
  this.knobs.chorus = new Knob('chorus', (v) => { this.chorus.wet.value = v }, 0, 1)
  this.knobs['revera-dw'] = new Knob('revera-dw', (v) => { this.revera.wet.value = v }, 0, 0.3)
  this.knobs['reverb-dw'] = new Knob('reverb-dw', (v) => { this.reverb.wet.value = v }, 0, 0.3)
  this.knobs['eq-high'] = new Knob('eq-high', (v) => { this.eq.high.value = v }, -25, 10, 1)
  this.knobs['eq-low'] = new Knob('eq-low', (v) => { this.eq.low.value = v }, -25, 10, 1)

  this.install = (host) => {
    this.revera.generate()
    this.reverb.generate()

    for (const knob of Object.values(this.knobs)) {
      knob.install(this.wrapper)
    }

    this.el.appendChild(this.wrapper)
    host.appendChild(this.el)
  }

  this.start = () => {
    console.log('Mixer', 'Start')

    this.inputs[0].connect(this.eq)
    this.inputs[1].connect(this.reverb)
    this.inputs[2].connect(this.revera)
    this.inputs[3].connect(this.cheby)

    this.cheby.connect(this.revera)
    this.revera.connect(this.chorus)
    this.chorus.connect(this.delay)
    this.delay.connect(this.reverb)
    this.reverb.connect(this.eq)

    this.eq.connect(this.compressor)

    this.compressor.connect(this.stereo)
    this.stereo.connect(this.limiter)
    this.limiter.toMaster()

    for (const id in this.knobs) {
      this.knobs[id].start()
    }

    this.update()
  }

  this.setBpm = (bpm) => {
    console.log('Mixer', 'BPM', bpm)
    Tone.Transport.bpm.rampTo(128, 2)
  }

  this.tweak = (ch, knob, val) => {
    const id = Object.keys(this.knobs)[(knob - 1) % 8]
    if (!this.knobs[id]) { return }
    this.knobs[id].tweak(val)
  }

  this.update = () => {
  }
}
