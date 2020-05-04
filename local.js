const clearStorageButton = document.querySelector('.clear');
const emptyStorageButton = document.querySelector('.empty');
const storageQuotaMsg = document.getElementById('storage-quota-msg');
const saveTextButton = document.getElementById('save-text');
const fileDownloadButton = document.getElementById('save');
const textField = document.querySelector('[name=text]');

function localStorageToFile() {
  const csv = JSON.stringify(localStorage['autosave']);
  console.log(csv);
  const csvAsBlob = new Blob([csv], { type: 'text/plain' });
  const fileNameToSaveAs = 'local-storage.txt';
  const downloadLink = document.getElementById('save');
  downloadLink.download = fileNameToSaveAs;

  if (window.URL !== null) {
    downloadLink.href = window.URL.createObjectURL(csvAsBlob);
    downloadLink.target = '_blank';
  } else {
    downloadLink.window.URL.createObjectURL(csvAsBlob);
    downloadLink.target = '_blank';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink.download);
  }
}

function localStorageSupport() {
  return typeof Storage !== 'undefined';
}

function localStorageAndQuota() {
  let myStory = document.getElementById('textArea').value;
  if (!localStorageSupport) {
    storageQuotaMsg.innerHTML = 'Sorry. No HTML5 local storage support here.';
  } else {
    try {
      if (localStorage.getItem('autosave', myStory)) {
        
        myStory = localStorage.getItem('autosave', myStory);
      } else {
        localStorage.setItem('autosave', myStory);
      }
    } catch (domException) {
      domException = new DOMException();
      console.log(domException.name);
      if (
        domException.name === 'QUOTA_EXCEEDED_ERR' ||
        domException.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        storageQuotaMsg.innerHTML = 'Local Storage Quota Exceeded!';
      }
    }
  }
}

function clearStorage() {
  const myStory = document.getElementById('textArea');
  myStory.value = '';
  localStorage.removeItem('autosave', myStory.value);
}

function emptyStorage() {
  const myStory = document.getElementById('textArea');
  myStory.value = '';
  localStorage.clear();
}

clearStorageButton.addEventListener('click', clearStorage);
emptyStorageButton.addEventListener('click', emptyStorage);
saveTextButton.addEventListener('click', function () {
  localStorageAndQuota();
  console.log('Message saved to localStorage.');
});
textField.addEventListener('input', () => {
  localStorage.setItem('autosave', textField.value);
});
fileDownloadButton.addEventListener('click', localStorageToFile);