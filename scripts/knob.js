'use strict'

function Knob (name, fn, min, max, initial = 0) {
  this.el = document.createElement('div')
  this.el.className = 'knob'
  this.slider = document.createElement('input')
  this.label = document.createElement('span')
  this.label.className = 'label'
  this.display = document.createElement('span')
  this.display.className = 'display'
  this.slider.setAttribute('type', 'range')
  this.slider.setAttribute('min', '0')
  this.slider.setAttribute('max', '100')
  this.slider.setAttribute('value', '25')

  const radius = 40
  const padding = 20
  const circ = Math.PI * radius

  this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  this.svg.style.width = (radius + padding) + 'px'
  this.svg.style.height = (radius + padding) + 'px'

  this.circlebg = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  this.circlebg.setAttribute('cx', (radius + padding) / 2)
  this.circlebg.setAttribute('cy', (radius + padding) / 2)
  this.circlebg.setAttribute('r', radius / 2)
  this.circlebg.setAttribute('class', 'bg')
  this.svg.appendChild(this.circlebg)

  this.circlefg = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  this.circlefg.setAttribute('cx', (radius + padding) / 2)
  this.circlefg.setAttribute('cy', (radius + padding) / 2)
  this.circlefg.setAttribute('r', radius / 2)
  this.circlefg.setAttribute('class', 'fg')
  this.circlefg.setAttribute('stroke-dasharray', circ + 'px')
  this.circlefg.setAttribute('stroke-dashoffset', circ + 'px')
  this.svg.appendChild(this.circlefg)

  this.slider.style.width = '40px'

  this.el.appendChild(this.svg)
  this.el.appendChild(this.slider)
  this.el.appendChild(this.label)
  this.el.appendChild(this.display)
  this.label.textContent = name

  this.install = (host) => {
    host.appendChild(this.el)
  }

  this.start = () => {
    this.slider.value = initial * 100
    this.update()
  }

  this.update = () => {
    fn(((max - min) * (this.slider.value / this.slider.max)) + min)
    this.display.textContent = this.slider.value

    this.circlefg.setAttribute('stroke-dashoffset', (circ * (1 - (this.slider.value / 100))) + 'px')
  }

  this.el.oninput = () => {
    this.update()
  }

  this.tweak = (val) => {
    this.slider.value = parseInt((val / 127) * 100)
    this.update()
  }
}
