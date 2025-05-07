let animationSpeed = 0.23; 
        
// Get the overlay element
const fuzzyOverlay = document.querySelector('.fuzzy-overlay');




// Animation function based on the script you found
function staticAnimate(element) {
    gsap.to(element, animationSpeed, {
        backgroundPosition: Math.floor(Math.random() * 100) + 1 + "% " + Math.floor(Math.random() * 10) + 1 + "%", 
        onComplete: staticAnimate,
        onCompleteParams: [element],
        ease: none
    });
}

// Start the animation
staticAnimate(fuzzyOverlay);