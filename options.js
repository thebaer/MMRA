// Saves options to chrome.storage
function save_options() {
  var hideDickbar = document.getElementById('dickbar').checked;
  var disableLazyImages = document.getElementById('images').checked;
  chrome.storage.sync.set({
    hideDickbar: hideDickbar,
    disableLazyImages: disableLazyImages
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Readability improved! (Settings saved.)';
    setTimeout(function() {
      status.textContent = '';
    }, 2500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    hideDickbar: false,
    disableLazyImages: false
  }, function(items) {
    document.getElementById('dickbar').checked = items.hideDickbar;
    document.getElementById('images').checked = items.disableLazyImages;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
