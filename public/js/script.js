document.addEventListener("DOMContentLoaded", function() {
    // Get the "Get Started" button element
    var getStartedButton = document.getElementById("getStartedButton");
  
    // Get the landing page and signup page elements
    var landingPage = document.getElementById("landingPage");
    var signupPage = document.getElementById("signupPage");
  
    // Event listener for the "Get Started" button click
    getStartedButton.addEventListener("click", function(event) {
      event.preventDefault(); // Prevent default link behavior
  
      // Show the signup page and dim the landing page
      signupPage.style.display = "block";
      landingPage.classList.add("dim");
    });
  });
  
  