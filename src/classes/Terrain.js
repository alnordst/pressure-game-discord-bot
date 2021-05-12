class Terrain {
  constructor(name, type) {
    this.name = name
    this.defenseModifier = 0
    this.passible = true
  }

  static fromChar(char) {
    if(char == '#')
      return new ImpassibleTerrain('mountain')
    else if(char == '^')
      return new ProtectedTerrain('forest')
    else if(char == '.')
      return new ExposedTerrain('road')
    else
      return new DefaultTerrain('plains')
  }

  get clone() {
    return Terrain.fromChar(this.toString())
  }
}


class DefaultTerrain extends Terrain {
  toString () {
    return '-'
  }
}


class ProtectedTerrain extends Terrain {
  constructor(name) {
    super(name)
    this.defenseModifier = 1
  }

  toString () {
    return '^'
  }
}


class ExposedTerrain extends Terrain {
  constructor(name) {
    super(name)
    this.defenseModifier = -1
  }

  toString () {
    return '_'
  }
}


class ImpassibleTerrain extends Terrain {
  constructor(name){
    super(name)
    this.passible = false
  }

  toString () {
    return '#'
  }
}


module.exports = Terrain