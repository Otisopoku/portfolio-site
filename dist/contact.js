(() => {
  const button = document.querySelector('.copy-email');
  const status = document.querySelector('.copy-status');
  const fallback = document.querySelector('.email-fallback');
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('otisopokua@gmail.com');
      fallback.hidden = true;
      status.textContent = 'Email address copied.';
    } catch {
      fallback.hidden = false;
      const input = fallback.querySelector('input');
      input.focus();
      input.select();
      status.textContent = 'Select and copy the email address above.';
    }
  });
})();
