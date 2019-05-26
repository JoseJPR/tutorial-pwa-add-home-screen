// Declare al pretty cats 😺
const cats = [
  {
    title: "Brown Scottish fold in brown thick-pile blanket",
    img: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Tricolored cat on green lawn grass taken at daytime",
    img: "https://images.unsplash.com/photo-1507984211203-76701d7bb120?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  },
  {
    title: "Gray kitten sitting on floor",
    img: "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  }
];

// Declare general function to change status prompt
const promptToggle = (element, toAdd, toRemove) => {
  element.classList.add(toAdd);
  element.classList.remove(toRemove);
};

// Declare general function to get or set status into storage
const statusPrompt = {
  get: () => {
    return localStorage.getItem('statusPrompt') || null;
  },
  set: (status) => {
    localStorage.setItem('statusPrompt', status);
    return;
  }
}

window.onload = (e) => { 

  // Set serviceWorker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Registration was successful 😜
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed 😯
      console.log('ServiceWorker registration failed: ', err);
    });
  }

  // Declare init HTML elements
  const list = document.querySelector('#list');
  const prompt = document.querySelector('#prompt');
  const buttonAdd = document.querySelector('#buttonAdd');
  const buttonCancel = document.querySelector('#buttonCancel');

  // Add all cats from array into list
  const items = cats.map(cat => {
    return `
      <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3">
        <div class="item">
          <img class="photo" src="${cat.img}" />
          <div class="h5">${cat.title}</div>
        </div>
      </div>
    `;
  })
  list.innerHTML = '<div class="row">' + items.join('') + '</div>';

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Show prompt modal if user previously not set to dismissed or accepted
    if(!statusPrompt.get()) {
      // Change status prompt
      promptToggle(prompt, 'show', 'hide');
    }
  });

  // Add event click function for Cancel button
  buttonCancel.addEventListener('click', (e) => {
    // Change status prompt
    promptToggle(prompt, 'hide', 'show');
    // Set status prompt to dismissed
    statusPrompt.set('dismissed');
  });

  // Add event click function for Add button
  buttonAdd.addEventListener('click', (e) => {
    // Change status prompt
    promptToggle(prompt, 'hide', 'show');
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          statusPrompt.set('accepted');
          console.log('User accepted the A2HS prompt');
        } else {
          statusPrompt.set('dismissed');
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
}