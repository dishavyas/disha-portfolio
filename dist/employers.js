(() => {
  const form = document.getElementById('employer-form');
  const button = document.getElementById('send-message');
  const status = document.getElementById('submission-status');
  const message = document.getElementById('sender-message');
  const name = document.getElementById('sender-name');
  for (const input of [name, message]) input.addEventListener('input', () => input.setCustomValidity(''));
  let timer;
  function reset() { button.disabled = false; status.textContent = ''; clearTimeout(timer); }
  addEventListener('pageshow', reset);
  form.addEventListener('submit', event => {
    for (const input of [name,message]) {
      if (!input.value.trim()) {
        event.preventDefault();input.setCustomValidity('Please enter text, not only spaces.');input.reportValidity();return;
      }
    }
    if (form.elements._honey.value) { event.preventDefault();status.textContent='Please reload the page and try again.';return; }
    button.disabled=true;
    status.textContent='Opening the submission service. Complete any spam check to finish sending.';
    timer=setTimeout(()=>{button.disabled=false;status.textContent='If the submission page did not open, check your connection and try again, or use the direct email link.';},15000);
  });
})();
