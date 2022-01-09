async function saveHandler(event) {
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const response = await fetch('/api/saves', {
        method: 'POST',
        body: JSON.stringify({
            post_id,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.save').addEventListener('click', saveHandler);
