const {triggerDebit, getWalletBalance, createWallet} = require('./controller/wallet.controller')

module.exports = {
    name: 'wallet',
    actions: {
       triggerDebit,
       getWalletBalance,
       createWallet
    }
}