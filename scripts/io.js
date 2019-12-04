'use strict'

function IO (client) {
  this.devices = []
  this.index = -1

  this.controller = null
  this.source = null

  this.install = (host) => {

  }

  this.start = () => {
    this.refresh()
    console.log('IO', 'Starting..')
  }

  this.connect = (source = 'Midi Through', controller = 'LPD8') => {
    this.controller = this.find(controller)
    this.source = this.find(source)

    if (!this.controller) {
      console.warn('IO', 'Could not connect ' + controller)
    } else {
      console.info('IO', 'Connected to controller ' + this.controller.name)
      this.controller.onmidimessage = this.onControl
    }

    if (!this.source) {
      console.warn('IO', 'Could not connect ' + source)
    } else {
      console.info('IO', 'Connected to source ' + this.source.name)
      this.source.onmidimessage = this.onMessage
    }
  }

  this.find = (name) => {
    for (const device of this.devices) {
      if (device.name.indexOf(name) < 0) { continue }
      return device
    }
  }

  this.refresh = () => {
    if (!navigator.requestMIDIAccess) { return }
    navigator.requestMIDIAccess().then(this.access, (err) => {
      console.warn('No Midi', err)
    })
  }

  this.list = () => {
    for (const device of this.devices) {
      console.info('IO', device.name)
    }
  }

  this.onControl = (msg) => {
    if (msg.data[0] >= 176 && msg.data[0] < 184) {
      const ch = msg.data[0] - 176
      const knob = msg.data[1] - 1
      const val = msg.data[2]
      client.mixer.tweak(ch, knob, val)
    } else if (msg.data[0] === 144) {
      const pad = msg.data[1]
      const vel = msg.data[2]
      client.rack.play(client.channel, pad, vel)
    }
  }

  this.onMessage = (msg) => {
    if (msg.data[0] >= 144 && msg.data[0] < 160) {
      const ch = msg.data[0] - 144
      const pad = msg.data[1] - 24
      const vel = msg.data[2]
      client.rack.play(ch, pad, vel)
    } else if (msg.data[0] >= 176 && msg.data[0] < 184) {
      const ch = msg.data[0] - 176
      const knob = msg.data[1] - 1
      const vel = msg.data[2]
      client.mixer.tweak(ch, knob, vel)
    }
  }

  this.access = (midiAccess) => {
    const inputs = midiAccess.inputs.values()
    this.devices = []
    for (let i = inputs.next(); i && !i.done; i = inputs.next()) {
      this.devices.push(i.value)
    }
    this.connect()
  }
}
