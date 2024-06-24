const  bcrypt = require('bcrypt');



class Hash {
  constructor() {
    this.saltRounds = 10;
  }

 async hashPassword(password){
    const hashPassword = await bcrypt.hash(password, this.saltRounds)
    return hashPassword
  }

  async comparePassword(password, passwordInDatbase){
    const passwordCorrect = await bcrypt.compare(password, passwordInDatbase)
    return passwordCorrect
  }
}


const hashFunction = new Hash()

module.exports = {hashFunction};