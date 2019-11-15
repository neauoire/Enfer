'use strict'

function Knob (name,source,key) {
  this.el = document.createElement('input')
  this.el.setAttribute('type', 'range')
  this.el.setAttribute('min', '0')
  this.el.setAttribute('max', '100')
  this.el.setAttribute('value', '50')

  this.el.oninput = () => {
    source[key] = parseInt(this.el.value)/100
    console.log(name, this.el.value+'%',source[key])
  }
}
