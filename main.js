// FAQ toggles for all pages
document.addEventListener("DOMContentLoaded", function() {
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var answer = btn.nextElementSibling;
      var isActive = btn.classList.contains('active');
      // Collapse all
      faqQuestions.forEach(function(b) {
        b.classList.remove('active');
        if (b.nextElementSibling) b.nextElementSibling.style.display = "none";
      });
      // Expand this one
      if (!isActive) {
        btn.classList.add('active');
        answer.style.display = "block";
      }
    });
  });
});