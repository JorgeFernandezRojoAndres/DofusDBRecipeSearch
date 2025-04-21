fetch('components/videoModal.html')
  .then(response => response.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    
    if (!localStorage.getItem('videoModalShown')) {
      modal.show();
      localStorage.setItem('videoModalShown', 'true');
    }
  });
