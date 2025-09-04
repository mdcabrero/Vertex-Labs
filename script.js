/**
 * Card Slider with Drag Functionality
 * Enables dragging of card sliders and navigation via arrow buttons
 */

/**
 * Initializes draggable card sliders on the page
 */
function initSliders() {
    // Get all slider wrappers on the page
    const sliderWrappers = document.querySelectorAll('.slider-wrapper');
    
    sliderWrappers.forEach(sliderWrapper => {
      const cardSlider = sliderWrapper.querySelector('.card-slider');
      if (!cardSlider) return; // Skip if no card slider inside
      
      // State variables for dragging
      let isDragging = false;
      let startX;
      let scrollLeft;
      let hasMoved = false;
      
      // Helper function to get current translation value
      const getCurrentTranslate = () => {
        const transform = cardSlider.style.transform;
        if (!transform || !transform.includes('translateX')) return 0;
        
        const match = transform.match(/translateX\((-?\d+)px\)/);
        return match ? parseInt(match[1]) : 0;
      };
      
      // Helper function to apply bounded translation
      const applyTranslation = (newTranslate, withTransition = false) => {
        // Calculate the maximum scrollable distance
        const maxScroll = -(cardSlider.offsetWidth - sliderWrapper.offsetWidth);
        // Apply bounds to prevent over-scrolling
        const boundedTranslate = Math.max(maxScroll, Math.min(0, newTranslate));
        
        // Apply the transform with or without transition
        cardSlider.style.transition = withTransition ? 'transform 0.3s ease-out' : 'none';
        cardSlider.style.transform = `translateX(${boundedTranslate}px)`;
        
        return boundedTranslate;
      };
      
      // Handle mousedown event to start dragging
      sliderWrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only respond to left mouse button
        
        isDragging = true;
        hasMoved = false;
        startX = e.pageX - sliderWrapper.offsetLeft;
        scrollLeft = getCurrentTranslate();
        
        // Disable transition during drag for immediate response
        cardSlider.style.transition = 'none';
        cardSlider.classList.add('is-dragging');
      });
      
      // Handle mousemove for dragging (on document level for better tracking)
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const x = e.pageX - sliderWrapper.offsetLeft;
        const walk = x - startX;
        
        // Consider it a drag after minimal movement
        if (Math.abs(walk) > 5) {
          hasMoved = true;
        }
        
        // Calculate new position and apply it
        const newTranslate = scrollLeft + walk;
        applyTranslation(newTranslate);
      });
      
      // Handle mouseup to end dragging
      document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        // Restore smooth transition when letting go
        cardSlider.style.transition = 'transform 0.3s ease-out';
        cardSlider.classList.remove('is-dragging');
      });
      
      // Prevent accidental clicks during drag
      cardSlider.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          if (hasMoved) {
            e.preventDefault();
            hasMoved = false;
          }
        });
      });
      
      // Prevent native browser dragging on images and links
      cardSlider.querySelectorAll('img, a').forEach(element => {
        element.addEventListener('dragstart', (e) => e.preventDefault());
      });
      
      // Add touch support for mobile devices
      sliderWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        hasMoved = false;
        startX = e.touches[0].pageX - sliderWrapper.offsetLeft;
        scrollLeft = getCurrentTranslate();
        
        cardSlider.style.transition = 'none';
      }, { passive: false });
      
      document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // prevent page from scrolling while dragging horizontally
        e.preventDefault();
        
        const x = e.touches[0].pageX - sliderWrapper.offsetLeft;
        const walk = x - startX;
        
        if (Math.abs(walk) > 5) {
          hasMoved = true;
        }
        
        const newTranslate = scrollLeft + walk;
        applyTranslation(newTranslate);
      }, { passive: false });
      
      document.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        cardSlider.style.transition = 'transform 0.3s ease-out';
      });
    });
  }
  
  /**
   * Initialize arrow button navigation for sliders
   */
  function initSliderArrows() {
    const arrowButtons = document.querySelectorAll('.arrow-btn');
    
    arrowButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Find the nearest slider to this button
        const section = button.closest('section');
        if (!section) return;
        
        const sliderWrapper = section.querySelector('.slider-wrapper');
        const cardSlider = section.querySelector('.card-slider');
        if (!sliderWrapper || !cardSlider) return;
        
        // Determine direction based on button position
        const isFirstButton = button === section.querySelector('.arrow-btn:first-of-type');
        const direction = isFirstButton ? 'prev' : 'next';
        
        // Calculate slide distance based on industry-card width
        const cards = cardSlider.querySelectorAll('.industry-card');
        if (cards.length === 0) return;
        
        const card = cards[0];
        const cardStyle = window.getComputedStyle(card);
        const slideDistance = card.offsetWidth + 
                      parseInt(cardStyle.marginLeft || 0) + 
                      parseInt(cardStyle.marginRight || 0);
        
        // Get current translation value
        const currentTranslate = cardSlider.style.transform ? 
            parseInt(cardSlider.style.transform.match(/translateX\((-?\d+)px\)/)?.[1] || 0) : 0;
        
        // Calculate new translation value based on direction
        let newTranslate;
        if (direction === 'prev') {
          // Move right (increase translate value)
          newTranslate = currentTranslate + slideDistance;
        } else {
          // Move left (decrease translate value)
          newTranslate = currentTranslate - slideDistance;
        }
        
        // Apply bounds to prevent over-scrolling
        const maxScroll = -(cardSlider.offsetWidth - sliderWrapper.offsetWidth);
        const boundedTranslate = Math.max(maxScroll, Math.min(0, newTranslate));
        
        // Apply smooth transition
        cardSlider.style.transition = 'transform 0.3s ease-out';
        cardSlider.style.transform = `translateX(${boundedTranslate}px)`;
      });
    });
  }
  
  // Initialize everything when the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    initSliderArrows();
  });



  /**
 * Testimonial Rotator
 * Automatically rotates through testimonials and allows selection via company logos
 */

// Sample testimonial data
const testimonials = [
  {
    logoImg: "assets/icons/kohls-logo.svg",
    quote: "Vertex Labs helped us consolidate disperse customer data from all our selling outlets. Their predictive models increased our inventory accuracy by 34% and reduced stockouts during peak seasons.",
    testimonee: "Sarah Martinez, VP of Sales at Kohl's"
  },
  {
    logoImg: "assets/icons/prudential-logo.svg",
    quote: "Their machine learning algorithms transformed our fraud detection capabilities. We now identify suspicious transactions 3x faster while reducing false positives by 28%, saving millions in potential losses.",
    testimonee: "James Chen, Risk Manager at Prudential"
  },
  {
    logoImg: "assets/icons/rhenus-logo.svg",
    quote: "Vertex Labs' supply chain analytics helped us optimize our delivery networks across 50+ distribution centers. We reduced logistics costs by $12M annually while improving delivery times by 18%.",
    testimonee: "Jakub Musial, Regional Manager at Rhenus Logistics"
  }
];

document.addEventListener('DOMContentLoaded', function() {
  // Get testimonial elements
  const testimonialBody = document.querySelector('.testimonial-body');
  const quoteElement = document.querySelector('[data-quote]');
  const testimoneeElement = document.querySelector('[data-person-name]');
  
  // Get logo container and logo elements
  const logoContainer = document.querySelector('.logo-container');
  const logoElements = document.querySelectorAll('.testimonials-logo');
  
  let currentIndex = 0;
  let timer;
  
  // Initialize logo images
  logoElements.forEach((logo, index) => {
    if (index < testimonials.length) {
      logo.src = testimonials[index].logoImg;
      logo.alt = testimonials[index].testimonee + " testimonial";
      
      // Add click event to each logo
      logo.addEventListener('click', () => {
        clearInterval(timer);
        updateTestimonial(index);
        startAutoRotation();
      });
    }
  });
  
  /**
   * Updates the testimonial content with smooth transition
   * @param {number} index - Index of the testimonial to display
   */
  function updateTestimonial(index) {
    // Store the current index
    currentIndex = index;
    
    // Fade out
    testimonialBody.style.opacity = 0;
    
    setTimeout(() => {
      // Update content
      quoteElement.textContent = testimonials[index].quote;
      
      // Update the testimonee (combined name and title)
      testimoneeElement.textContent = testimonials[index].testimonee;
      
      // Highlight the selected logo
      logoElements.forEach((logo, i) => {
        if (i === index) {
          logo.classList.add('active');
        } else {
          logo.classList.remove('active');
        }
      });
      
      // Fade in
      testimonialBody.style.opacity = 1;
    }, 350); // Short delay for fade effect
  }
  
  /**
   * Starts the automatic rotation of testimonials
   */
  function startAutoRotation() {
    // Clear any existing timer
    clearInterval(timer);
    
    // Set a new timer
    timer = setInterval(() => {
      // Move to next testimonial
      const nextIndex = (currentIndex + 1) % testimonials.length;
      updateTestimonial(nextIndex);
    }, 10000); // Change every 10 seconds
  }
  
  // Add transition for smooth fade effect
  testimonialBody.style.transition = 'opacity 0.3s ease';
  
  // Initialize with the first testimonial
  updateTestimonial(0);
  
  // Start the automatic rotation
  startAutoRotation();
});

/**
* FAQ Accordion Functionality
* Allows users to expand/collapse FAQ items with smooth animations
*/
function setupAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // Make sure answer has proper initial state
    answer.style.height = '0px';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'height 0.3s ease-out';
    
    // Remove hidden attribute but keep it visually hidden with height
    if (answer.hasAttribute('hidden')) {
      answer.removeAttribute('hidden');
    }
    
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Close all other accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherQuestion = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          
          otherItem.classList.remove('active');
          otherAnswer.style.height = '0px';
          otherQuestion.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current accordion
      if (!isExpanded) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        
        // Animate height
        const height = answer.scrollHeight;
        answer.style.height = `${height}px`;
        
        // Apply styling to button
        const faqBtn = question.querySelector('.faq-btn');
        if (faqBtn) {
          faqBtn.classList.add('active');
        }
      } else {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.height = '0px';
        
        // Reset button styling
        const faqBtn = question.querySelector('.faq-btn');
        if (faqBtn) {
          faqBtn.classList.remove('active');
        }
      }
    });
  });
}



  /**
 * FAQ Accordion Functionality
 * Allows users to expand/collapse FAQ items with smooth animations
 */
function setupAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      // Make sure answer has proper initial state
      answer.style.height = '0px';
      answer.style.overflow = 'hidden';
      answer.style.transition = 'height 0.3s ease-out';
      
      // Remove hidden attribute but keep it visually hidden with height
      if (answer.hasAttribute('hidden')) {
        answer.removeAttribute('hidden');
      }
      
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other accordions
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            
            otherItem.classList.remove('active');
            otherAnswer.style.height = '0px';
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current accordion
        if (!isExpanded) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
          
          // Animate height
          const height = answer.scrollHeight;
          answer.style.height = `${height}px`;
          
          // Apply styling to button
          const faqBtn = question.querySelector('.faq-btn');
          if (faqBtn) {
            faqBtn.classList.add('active');
          }
        } else {
          item.classList.remove('active');
          question.setAttribute('aria-expanded', 'false');
          answer.style.height = '0px';
          
          // Reset button styling
          const faqBtn = question.querySelector('.faq-btn');
          if (faqBtn) {
            faqBtn.classList.remove('active');
          }
        }
      });
    });
  }
  
  // Initialize accordion when DOM is ready
  document.addEventListener('DOMContentLoaded', setupAccordion);



  /**
 * Video Stopper
 * Stops video from 'about-section' after 7s to convert into a static image
 */

function pauseVideoAtFrame() {
    const video = document.getElementById('about-video');
    
    video.addEventListener('timeupdate', function() {
        if (video.currentTime >= 7) {
            video.pause();
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', pauseVideoAtFrame);



/**
 * Contact Modal Functionality
 * Handles opening/closing of contact modal with smooth animations
 */
   // Configuration
        const CONTACT_EMAIL = 'contact@yourcompany.com';

        /**
         * Initialize contact modal functionality
         */
        function initContactModal() {
            // Get DOM elements
            const elements = {
                connectBtn: document.getElementById('connect-btn'),
                overlay: document.getElementById('modalOverlay'),
                modal: document.getElementById('contactModal'),
                closeBtn: document.getElementById('closeBtn'),
                copyWrapper: document.getElementById('copyEmailWrapper')
            };

            // Verify all elements exist
            if (!elements.connectBtn || !elements.overlay || !elements.modal) {
                console.warn('Contact modal elements not found');
                return;
            }

            // Modal state
            let isModalOpen = false;
            let copyTimeout = null;

            /**
             * Opens the contact modal
             */
            function openModal() {
                if (isModalOpen) return;
                
                elements.overlay.classList.add('active');
                elements.modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                isModalOpen = true;
                
                // Reset copy state when opening
                if (elements.copyWrapper) {
                    elements.copyWrapper.classList.remove('success');
                }
                
                // Focus management for accessibility
                if (elements.closeBtn) {
                    elements.closeBtn.focus();
                }
            }

            /**
             * Closes the contact modal
             */
            function closeModal() {
                if (!isModalOpen) return;
                
                elements.overlay.classList.remove('active');
                elements.modal.classList.remove('active');
                document.body.style.overflow = '';
                isModalOpen = false;
                
                // Return focus to trigger element
                elements.connectBtn.focus();
            }

            /**
             * Copies email to clipboard with inline feedback
             */
            async function copyEmailToClipboard() {
                try {
                    await navigator.clipboard.writeText(CONTACT_EMAIL);
                    showCopySuccess();
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = CONTACT_EMAIL;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    textArea.style.pointerEvents = 'none';
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        showCopySuccess();
                    } catch (copyErr) {
                        console.error('Failed to copy email:', copyErr);
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            }

            /**
             * Shows copy success state
             */
            function showCopySuccess() {
                if (!elements.copyWrapper) return;
                
                // Clear any existing timeout
                if (copyTimeout) {
                    clearTimeout(copyTimeout);
                }
                
                // Change text content directly
                const textElement = elements.copyWrapper.querySelector('p');
                const originalText = textElement.textContent;
                textElement.textContent = 'Copied to clipboard!';
                
                // Add success class for icon change
                elements.copyWrapper.classList.add('success');
                
                // Reset after 2 seconds
                copyTimeout = setTimeout(() => {
                    textElement.textContent = originalText;
                    elements.copyWrapper.classList.remove('success');
                    copyTimeout = null;
                }, 2000);
            }

            /**
             * Handles keyboard events
             */
            function handleKeydown(e) {
                if (e.key === 'Escape' && isModalOpen) {
                    closeModal();
                }
            }

            /**
             * Prevents modal from closing when clicking inside it
             */
            function handleModalClick(e) {
                e.stopPropagation();
            }

            // Event Listeners
            elements.connectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
            
            if (elements.closeBtn) {
                elements.closeBtn.addEventListener('click', closeModal);
            }
            
            elements.overlay.addEventListener('click', closeModal);
            
            if (elements.copyWrapper) {
                elements.copyWrapper.addEventListener('click', copyEmailToClipboard);
            }
            
            elements.modal.addEventListener('click', handleModalClick);
            document.addEventListener('keydown', handleKeydown);

            // Return public API if needed
            return {
                open: openModal,
                close: closeModal
            };
        }
// Initialize contact modal when DOM is ready
document.addEventListener('DOMContentLoaded', initContactModal);
