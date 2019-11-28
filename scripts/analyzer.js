'use strict'

/* global Tone */
/* global requestAnimationFrame */

function Analyzer (mixer) {
  this.el = document.createElement('canvas')
  this.el.id = 'analyzer'
  this.el.width = 100
  this.el.height = 80

  this.waveform = new Tone.Waveform(128)

  this.context = this.el.getContext('2d')

  this.install = (host) => {
    host.appendChild(this.el)

    this.context.lineWidth = 1
    this.context.strokeStyle = 'black'
  }

  this.start = () => {
    // this.animate()
  }

  this.update = () => {
    const values = this.waveform.getValue()
    const canvasWidth = 100
    const canvasHeight = 80
    this.context.clearRect(0, 0, canvasWidth, canvasHeight)

    this.context.beginPath()

    for (let i = 1, len = values.length; i < len; i++) {
      if (i % 2 !== 0) { continue }
      const x = parseInt(canvasWidth * (i / len))
      const y = parseInt(((values[i] + 1) / 2) * canvasHeight)
      this.context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2))
    }

    this.context.stroke()
    this.context.closePath()
  }

  this.animate = () => {
    requestAnimationFrame(this.animate)
    this.update()
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
