const mockDatabase = require('../../database/mock.database').database
let currentUser;
module.exports = {
    name: 'user',
    actions: {
       async getCurrentUser(ctx){
        if(!currentUser){
            return {success: false, message: 'user not signed in'}
        }
         return {success: true, currentUser};
       },

       async setCurrentUser(ctx) {  //emulating the login function
          const fetchedUser = mockDatabase.find((user) => user.id == ctx.params.userId);
          currentUser = fetchedUser;
          this.logger.info(`You are logged in with ${currentUser.name}`)
      },

      async getUserBalance(){
        if(!currentUser){
            return 'Please sign in to retrieve your user balance'
        }

        return currentUser.balance;
      },  

      async userDepositM(ctx){

      }
    },

    
}