'use strict'

function IO (client) {
  this.inputs = []
  this.index = -1

  this.install = (host) => {

  }

  this.start = () => {
    this.refresh()
    console.log('IO', 'Starting..')
  }

  this.device = () => {
    return this.inputs[this.index]
  }

  this.receive = (msg) => {
    if (msg.data[0] >= 144 && msg.data[0] < 160) {
      const ch = msg.data[0] - 144
      const pad = msg.data[1] - 24
      client.rack.play(ch, pad)
    }
  }

  this.selectInput = (id) => {
    if (this.device()) { this.device().onmidimessage = null }
    if (id === -1) { this.index = -1; console.log('MIDI', 'Deselected Midi Device'); return }
    if (!this.inputs[id]) { return }

    this.index = id
    this.device().onmidimessage = (msg) => { this.receive(msg) }
    console.log('MIDI', `Select Input Device: ${this.device().name}`)
  }

  this.refresh = () => {
    if (!navigator.requestMIDIAccess) { return }
    navigator.requestMIDIAccess().then(this.access, (err) => {
      console.warn('No Midi', err)
    })
  }

  this.access = (midiAccess) => {
    const inputs = midiAccess.inputs.values()
    this.inputs = []
    for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
      this.inputs.push(i.value)
    }
    this.selectInput(0)
  }
}
