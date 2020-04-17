const new_tweet_btn = document.querySelector('button');
const txtarea = document.querySelector('textarea');
const cards = document.querySelector('.cards');
const API = 'https://crud-database.herokuapp.com/tweets';

// On Button Click
new_tweet_btn.addEventListener('click', () => {
    const text = txtarea.value;
    const obj = {
        body: text
    };

    // Send The Data To The API
    fetch(API, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
        .then(res => res.json())
        .then(response => {
            //When POST Request is DONE!
            // console.log(response);

            // We Will Append The Just Saved Item As A New HTML Element!
            cards.innerHTML += createCard(response);

            // REST
            txtarea.value = '';
            new_tweet_btn.setAttribute('disabled', true);
        });
});

// Watch the textarea
txtarea.addEventListener('keypress', e => {
    if (e.target.value.length > 0) {
        new_tweet_btn.removeAttribute('disabled');
    } else {
        new_tweet_btn.setAttribute('disabled', true);
    }
});

// On Page Load
fetch(API)
    .then(res => res.json())
    .then(data => {
        data.forEach(item => {
            cards.innerHTML += createCard(item);
        });
    });

function createCard(singleTweetObject) {
    let card = `
        <div class="card">
            <h5>ID: ${singleTweetObject.id}</h5>
            <p>
                ${singleTweetObject.body}
            </p>

            <input value="${singleTweetObject.body}" />
            
            <button data-id="${singleTweetObject.id}" class="btn btn-danger">
                Delete
            </button>
            <button data-id="${singleTweetObject.id}"class="btn btn-warning">
                Edit
            </button>

            <button 
                style="display: none" 
                data-id="${singleTweetObject.id}" 
                class="btn btn-success"
            >
                Save
            </button>
        </div>
    `;

    return card;
}

// Watch for clicks on new created btns!
cards.addEventListener('click', e => {
    // Watch the Delete button
    if (e.target.classList.contains('btn-danger')) {
        let id = e.target.getAttribute('data-id');

        fetch(API + '/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.json())
            .then(data => {
                // This code will run when the DELETE Request is Finished!!!
                e.target.parentNode.remove();
            });
    }

    // Watch the Edit button
    if (e.target.classList.contains('btn-warning')) {
        let card = e.target.parentNode;
        // Hide some stuff
        card.querySelector('p').style.display = 'none';
        card.querySelector('.btn-danger').style.display = 'none';
        card.querySelector('.btn-warning').style.display = 'none';
        // Show some stuff
        card.querySelector('input').style.display = 'block';
        card.querySelector('.btn-success').style.display = 'block';
    }

    // Watch the Save button
    if (e.target.classList.contains('btn-success')) { 
 
        let id = e.target.getAttribute('data-id');
        let card = e.target.parentNode;
        card.querySelector('p').style.display = 'block';
        card.querySelector('input').style.display = 'none';
        card.querySelector('.btn-success').style.display = 'none';
        card.querySelector('.btn-danger').style.display = 'inline-block';
        card.querySelector('.btn-warning').style.display = 'inline-block'; 
        const obj = {
            body: card.querySelector('input').value
        };
        console.log(obj)
        fetch(API + '/' + id, {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })

    }
});
