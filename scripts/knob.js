'use strict'

function Knob (name, source, key, min, max, initial = 0) {
  this.el = document.createElement('div')
  this.el.className = 'knob'
  this.slider = document.createElement('input')
  this.label = document.createElement('span')
  this.slider.setAttribute('type', 'range')
  this.slider.setAttribute('min', '0')
  this.slider.setAttribute('max', '100')
  this.slider.setAttribute('value', '25')

  this.slider.style.width = '40px'

  this.el.appendChild(this.slider)
  this.el.appendChild(this.label)
  this.label.textContent = name

  this.install = (host) => {
    host.appendChild(this.el)
  }

  this.start = () => {
    this.slider.value = initial * 100
    this.update()
  }

  this.update = () => {
    source[key] = ((max - min) * (this.slider.value / this.slider.max)) + min
    this.label.textContent = name + ' ' + this.slider.value + '%'
  }

  this.el.oninput = () => {
    this.update()
  }

  this.tweak = (val) => {
    this.slider.value = parseInt((val / 127) * 100)
    this.update()
  }
}
