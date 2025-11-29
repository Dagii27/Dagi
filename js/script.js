// adding funtionality to back to top button 

//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click",function(){
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// Handle video playback
document.addEventListener('DOMContentLoaded', function() {
    const videos = document.querySelectorAll('.portfolio-video video');
    
    videos.forEach(video => {
        // Pause all videos when leaving viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    video.pause();
                }
            });
        });
        
        observer.observe(video);
        
        // Add loading indicator
        video.addEventListener('loadstart', function() {
            this.parentElement.classList.add('loading');
        });
        
        video.addEventListener('canplay', function() {
            this.parentElement.classList.remove('loading');
        });
    });
});

// Enhanced filter functionality
const filterButtons = document.querySelectorAll('.filter-item');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Add this to your script.js file
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = [
    "Frontend Developer",
    "Backend Developer",
    "Video Editor",
    "UI/UX Designer",
    "Web Developer"
];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);

    // close mobile nav when a link is clicked
    const navToggler = document.querySelector('.nav-menu');
    const navCollapse = document.getElementById('navbarNav');
    if (navToggler && navCollapse) {
        const navLinks = navCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
                    navToggler.click();
                }
            });
        });
    }

    // contact form validation + send to Telegram
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');
        const successText = document.getElementById('contact-success');
        const errorText = document.getElementById('contact-error');

        const badWords = ['hate', 'kill', 'racist', 'terror', 'terrorist', 'suicide', 'bomb'];

        function containsBadWords(text) {
            const lower = text.toLowerCase();
            return badWords.some(w => lower.includes(w));
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            // reset state
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('is-invalid');
            });
            if (successText) successText.classList.add('d-none');
            if (errorText) errorText.classList.add('d-none');

            // name required
            const nameValue = nameInput.value.trim();
            if (!nameValue) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            }

            // email
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailValue || !emailRegex.test(emailValue)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            }

            // message: required + minimum words + simple bad word filter
            const messageValue = messageInput.value.trim();
            if (!messageValue) {
                messageInput.classList.add('is-invalid');
                isValid = false;
            } else {
                const words = messageValue.split(/\s+/).filter(Boolean);
                if (words.length < 5) {
                    messageInput.classList.add('is-invalid');
                    isValid = false;
                }

                if (containsBadWords(messageValue)) {
                    messageInput.classList.add('is-invalid');
                    isValid = false;
                }
            }

            if (!isValid) {
                return;
            }

            // Send via Web3Forms (works on GitHub Pages - replace YOUR_ACCESS_KEY)
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: '29de21f6-1702-4388-8bc8-5b8d55cecbd2',
                    name: nameValue,
                    email: emailValue,
                    message: messageValue
                })
            })

            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    contactForm.reset();
                    if (successText) successText.classList.remove('d-none');
                } else {
                    if (errorText) {
                        errorText.textContent = data.error || 'Sorry, something went wrong. Please try again.';
                        errorText.classList.remove('d-none');
                    }
                }
            })
            .catch(() => {
                if (errorText) {
                    errorText.textContent = 'Network error. Please try again.';
                    errorText.classList.remove('d-none');
                }
            });
        });
    }
});