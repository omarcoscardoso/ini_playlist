const divInstall = document.getElementById('installContainer');
const butInstall = document.getElementById('butInstall');

/* Put code here */

/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

/**
 * Warn the page must be served over HTTPS
 * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
 * Installability requires a service worker with a fetch event handler, and
 * if the page isn't served over HTTPS, the service worker won't load.
 */
if (window.location.protocol === 'http:') {
  const requireHTTPS = document.getElementById('requireHTTPS');
  const link = requireHTTPS.querySelector('a');
  link.href = window.location.href.replace('http://', 'https://');
  requireHTTPS.classList.remove('hidden');
}

let deferredPrompt; // Allows to show the install prompt
let setupButton;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log("beforeinstallprompt fired");
    if (setupButton == undefined) {
        setupButton = document.getElementById("setup_button");
    }
    // Show the setup button
    setupButton.style.display = "inline";
    setupButton.disabled = false;
});

function installApp() {
  // Show the prompt
  deferredPrompt.prompt();
  setupButton.disabled = true;
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
      .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
              console.log('PWA setup accepted');
              // hide our user interface that shows our A2HS button
              setupButton.style.display = 'none';
          } else {
              console.log('PWA setup rejected');
          }
          deferredPrompt = null;
      });
}