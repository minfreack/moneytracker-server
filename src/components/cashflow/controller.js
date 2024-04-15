const dayjs = require("dayjs");
const { db } = require("../../lib/firebase");
const { groupTransactionsByDate } = require("../../utils");
const newTransaction = async(data) => {
    try {
        const querySnapshot = await db.collection('users').doc(data?.userID).get()
        if (querySnapshot?.exists) {
            const userData = querySnapshot.data();
            await db.collection('users').doc(data?.userID).collection('cashflow').add({createdAt: dayjs().valueOf(),...data?.transactionData});
            if(data?.transactionData?.type === 'income'){
                await db.collection('users').doc(data?.userID).update({
                    income: (userData?.income || 0) + data?.transactionData?.amount,
                    balance: (userData?.balance || 0) + data?.transactionData?.amount
                })
            }else{
                await db.collection('users').doc(data?.userID).update({
                    expenses: (userData?.expenses || 0) + data?.transactionData?.amount,
                    balance: (userData?.balance || 0) - data?.transactionData?.amount
                })
            }
            return {
                status: 200,
                data : {
                    success: true,
                    data: data?.userID,
                }
            } 
        }  
    } catch (error) {
        console.log(error);
        return {
            status: 200,
            data : {
                success: false,
                error: 'Hubo un error',
                data: data?.userID
            }
        }   
    }
}

const getLastTransactions = async(userID) => {
    try {
        const transactions = []
        const transactionsSnapshot = await db
        .collection('users')
        .doc(userID)
        .collection('cashflow')
        .where('date', '>=', Date.now() - (7 * 24 * 60 * 60 * 1000))
        .orderBy('date', 'desc')
        .orderBy('createdAt', 'desc')
        .get();
        transactionsSnapshot.forEach((doc) => {
            transactions.push(doc.data())
        });
        const querySnapshot = await db.collection('users').doc(userID).get()
        const records = groupTransactionsByDate(transactions)
        const userData = querySnapshot.data();
        return {
            status: 200,
            data : {
                success: true,
                data: {
                    lastTransactions: transactions,
                    records,
                    income: userData?.income || 0,
                    expenses: userData?.expenses || 0,
                    total: userData?.balance || 0
                },
            }
        }   
    } catch (error) {
        console.log(error);
        return {
            status: 200,
            data : {
                success: false,
                error: 'Hubo un error',
                data: userID
            }
        }   
    }
}

const getTransactions = async(userID) => {
    try {
        const transactions = []
        const transactionsSnapshot = await db.collection('users').doc(userID).collection('cashflow')?.orderBy('date', 'desc')?.orderBy('createdAt', 'desc')?.get()
        transactionsSnapshot.forEach((doc) => {
            transactions.push(doc.data())
        });
        const records = groupTransactionsByDate(transactions)
        return {
            status: 200,
            data : {
                success: true,
                data: {
                    transactions,
                    records
                },
            }
        }   
    } catch (error) {
        console.log(error);
        return {
            status: 200,
            data : {
                success: false,
                error: 'Hubo un error',
                data: userID
            }
        }   
    }
}

module.exports = {
    newTransaction,
    getLastTransactions,
    getTransactions
}