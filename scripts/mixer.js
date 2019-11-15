'use strict'

/* global Tone */
/* global Analyzer */
/* global Knob */

function Mixer (client) {
  this.el = document.createElement('div')
  this.el.id = 'mixer'
  this.wrapper = document.createElement('div')

  this.analyzer = new Analyzer(this)

  this.inputs = [
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0),
    new Tone.EQ3(0, 0, 0)
  ]

  this.cheby = new Tone.Chebyshev(50)

  this.eq = new Tone.EQ3(0, -5, 0)
  this.compressor = new Tone.Compressor(-12, 10)
  this.filterh = new Tone.Filter(10000, 'highpass')
  this.filterl = new Tone.Filter(10000, 'lowpass')

  this.chorus = new Tone.Chorus()
  this.revera = new Tone.Reverb({ decay: 10, preDelay: 0.01 })
  this.reverb = new Tone.Reverb({ decay: 20, preDelay: 0.01 })
  this.stereo = new Tone.StereoWidener()
  this.limiter = new Tone.Limiter(0)

  this.knobs = {}
  this.knobs.cheby = new Knob('cheby', this.cheby.wet, 'value', 0, 0.5)
  this.knobs.chorus = new Knob('chorus', this.chorus.wet, 'value', 0, 1)
  this.knobs['revera-dw'] = new Knob('revera-dw', this.revera.wet, 'value', 0, 0.3)
  this.knobs['reverb-dw'] = new Knob('reverb-dw', this.reverb.wet, 'value', 0, 0.3)
  this.knobs['eq-high'] = new Knob('eq-high', this.eq.high, 'value', -25, 10, 1)
  this.knobs['eq-low'] = new Knob('eq-low', this.eq.low, 'value', -25, 10, 1)
  this.knobs.compressor = new Knob('compressor', this.compressor.threshold, 'value', -30, -15)
  this.knobs.stereo = new Knob('stereo', this.stereo.width, 'value', 0.25, 0.75, 0.5)

  this.install = (host) => {
    this.revera.generate()
    this.reverb.generate()

    for (const knob of Object.values(this.knobs)) {
      knob.install(this.wrapper)
    }

    this.analyzer.install(this.el)

    this.el.appendChild(this.wrapper)
    host.appendChild(this.el)
  }

  this.start = () => {
    console.log('Mixer', 'Start')

    this.inputs[0].connect(this.eq)
    this.inputs[1].connect(this.revera)
    this.inputs[2].connect(this.reverb)
    this.inputs[3].connect(this.cheby)

    this.reverb.generate()

    this.cheby.connect(this.revera)
    this.revera.connect(this.chorus)
    this.chorus.connect(this.reverb)
    this.reverb.connect(this.eq)

    this.eq.connect(this.compressor)

    this.compressor.connect(this.stereo)
    this.stereo.connect(this.limiter)
    this.limiter.toMaster()

    this.limiter.fan(this.analyzer.waveform)
    this.analyzer.start()

    for (const id in this.knobs) {
      this.knobs[id].start()
    }

    this.update()
  }

  this.update = () => {
  }
}
