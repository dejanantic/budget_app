// Toggle .js-active, toggle also if clicking outside of an active transaction
document.addEventListener('click', function toggleJsActive(e) {

    if (e.target.closest('li.js-transaction')) {

        const TRANSACTION = e.target.closest('li');

        TRANSACTION.classList.toggle('js-active');

        return;
    }

    resetTransactions();
})

/*****************************************************************************/
/***********************   FUNCTION DECLARATIONS   ***************************/
/*****************************************************************************/

// Remove .js-active from transaction when clicking away
function resetTransactions() {

    const TRANSACTIONS = document.querySelectorAll('.js-transaction');

    TRANSACTIONS.forEach(function (transaction) {
        transaction.classList.remove('js-active');
    });
}