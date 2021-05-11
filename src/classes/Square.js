const Terrain = require('./Terrain')
const Unit = require('./Unit')

class Square {
  constructor(terrain, unit) {
    this.terrain = terrain
    this.unit = unit
  }

  static fromChar(char) {
    return new Square(Terrain.fromChar(char), Unit.fromChar(char))
  }

  static moveUnit(from, to) {
    console.log('\nmove', from, to)
    if(from.unit && to.terrain.passible){
      to.unit = from.unit.clone
      from.unit = null
      return true
    } else
      return false
  }

  get clone() {
    return new Square(this.terrain.clone, this.isEmpty ? null : this.unit.clone)
  }

  get isEmpty() {
    return !this.unit
  }

  toString() {
    if(this.isEmpty)
      return this.terrain.toString()
    else
      return this.unit.toString()
  }
}

module.exports = Square