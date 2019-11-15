'use strict'

function Knob (name) {
  this.el = document.createElement('input')
  this.el.setAttribute('type', 'range')
  this.el.setAttribute('min', '0')
  this.el.setAttribute('max', '50')
  this.el.setAttribute('value', 'range')

  this.el.oninput = () => {
    console.log(name, this.el.value)
  }
}
