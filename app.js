// Toggle transaction remove button and make it clickable

document.addEventListener('click', function toggleDeleteButton(e) {

    // If an element is clicked and it's not a transaction element or its'
    // child, return
    if (!e.target.matches('.js-transaction') && !e.target.closest('LI')) return;

    let transaction = e.target.closest('LI');
    let deleteBtn = transaction.children[transaction.children.length - 1];

    // If another transaction already selected, toggle 'js-active' of the
    // previous transaction
    clearPreviousSelection(transaction);

    transaction.classList.toggle('js-active');

    // If deleteBtn is hidden, set deleteBtn's z-index to 1
    if (!deleteBtn.classList.contains('bring-to-front')) {

        // Run after 2ms because that's how long the transition lasts
        setTimeout(() => {
            deleteBtn.classList.toggle('bring-to-front')
        }, 200);

    };

    // If deleteBtn is visible, set deleteBtn z-index to -1
    if (deleteBtn.classList.contains('bring-to-front')) deleteBtn.classList.toggle('bring-to-front');

    console.log('toggle ran');

})

function clearPreviousSelection(clickedTransaction) {

    const TRANSACTIONS = document.querySelectorAll('.transaction');

    TRANSACTIONS.forEach(function removeActiveStatus(transaction) {
        if (clickedTransaction.dataset.transactionId === transaction.dataset.transactionId) return;
        if (transaction.classList.contains('.js-active')) transaction.classList.toggle('.js-active');
        console.log(transaction.dataset.transactionId);
    })


}