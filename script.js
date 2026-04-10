document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that have the fade-up class
    const fadeElements = document.querySelectorAll('.fade-up');

    // Setup the Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each element
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // --- GSAP Canvas Image Scrub ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const canvas = document.querySelector('#scroll-canvas');
        if (canvas) {
            const context = canvas.getContext('2d');
            
            // Set internal resolution of the canvas (Apple's sequence is 1158x770)
            canvas.width = 1158;
            canvas.height = 770;

            const frameCount = 147;
            const currentFrame = index => (
                `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(index + 1).toString().padStart(4, '0')}.jpg`
            );

            const images = [];
            const playhead = { frame: 0 };

            // 1. Preload frames
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i);
                images.push(img);
            }

            // Draw the first frame natively when it loads so it isn't blank
            images[0].onload = render;

            // 2. Render Function (draws current frame based on playhead)
            function render() {
                if(images[playhead.frame] && images[playhead.frame].complete) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(images[playhead.frame], 0, 0);
                }
            }

            // 3. GSAP Timeline mapped to ScrollTrigger
            gsap.to(playhead, {
                frame: frameCount - 1,
                snap: "frame", // Snap playhead values to integers (0, 1, 2...)
                ease: "none",
                scrollTrigger: {
                    trigger: ".section-video-scroll",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5 // Smoothing interpolation
                },
                onUpdate: render // Render the canvas every time GSAP updates the playhead
            });
        }
    }
});
