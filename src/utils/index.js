const dayjs = require("dayjs");

const groupTransactionsByDate = (transactions) => {
    const groupedTransactions = {};
    // Iterar sobre las transacciones
    transactions.forEach(transaction => {
        // Obtener la fecha de la transacción (en milisegundos)
        const transactionDate = transaction.date;

        // Convertir la fecha a un formato legible (por ejemplo, YYYY-MM-DD)
        const formattedDate = dayjs(transactionDate).valueOf();

        // Verificar si ya existe un grupo para esta fecha
        if (!groupedTransactions[formattedDate]) {
            // Si no existe, crear un nuevo grupo con esta fecha como clave
            groupedTransactions[formattedDate] = {
                date: formattedDate,
                income: 0,
                expense: 0
            };
        }
        groupedTransactions[formattedDate].transactions = groupedTransactions[formattedDate].transactions?.length > 0 ? [...groupedTransactions[formattedDate].transactions, transaction] : [transaction];
        // Actualizar los ingresos y egresos en el grupo correspondiente
        if (transaction.type === 'income') {
            groupedTransactions[formattedDate].income += transaction.amount;
        } else if (transaction.type === 'expense') {
            groupedTransactions[formattedDate].expense += transaction.amount;
        }
        groupedTransactions[formattedDate].total = groupedTransactions[formattedDate].income - groupedTransactions[formattedDate].expense;

    });

    return groupedTransactions;
};

module.exports = {
    groupTransactionsByDate
}