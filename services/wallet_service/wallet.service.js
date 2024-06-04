const {triggerDebit, getWalletBalance, createWallet, addMoneyToWallet} = require('./controller/wallet.controller')
module.exports = {
    name: 'wallet',
    actions: {
       triggerDebit,
       getWalletBalance,
       createWallet,
       addMoneyToWallet
    },

}