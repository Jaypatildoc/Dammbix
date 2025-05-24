// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize 3D scenes
    initHero3D();
    initAbout3D();
    
    // Initialize menu toggle for mobile
    initMobileMenu();
    
    // Initialize stat counters
    initStatCounters();
});

// Loading Screen
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const progress = document.querySelector('.progress');
    const body = document.body;
    
    // Prevent scrolling during loading
    body.style.overflow = 'hidden';
    
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                body.style.overflow = '';
            }, 500);
        } else {
            width += Math.random() * 10;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 200);
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Add a slight delay to the follower for a smooth effect
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });
    
    // Change cursor size on clickable elements
    const clickables = document.querySelectorAll('a, button, .menu-toggle');
    clickables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
            cursorFollower.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
}

// Scroll Animations
function initScrollAnimations() {
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Initialize GSAP ScrollTrigger for section animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Services section animation
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
    
    // About section animation
    gsap.from('.about-text p', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
    
    // Portfolio section animation
    gsap.from('.portfolio-item', {
        scrollTrigger: {
            trigger: '.portfolio-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
    
    // Contact section animation
    gsap.from('.contact-form, .info-item', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
}

// Hero 3D Scene
function initHero3D() {
    const container = document.getElementById('hero-3d-scene');
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create a particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position particles in a sphere
        const radius = 10 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);
        
        // Random scale for each particle
        scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Create material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Add a soft light to illuminate the particles
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00f0ff, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 20;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate particle system
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;
        
        // Make particles pulse
        const time = Date.now() * 0.0005;
        particleSystem.material.size = 0.05 + 0.03 * Math.sin(time);
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Mouse interaction
    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        
        gsap.to(particleSystem.rotation, {
            x: mouseY * 0.1,
            y: mouseX * 0.1,
            duration: 2
        });
    });
}

// About 3D Scene
function initAbout3D() {
    const container = document.getElementById('about-3d-scene');
    
    if (!container) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create a torus knot
    const geometry = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
    
    // Create a shader material for a holographic effect
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x00f0ff) },
            color2: { value: new THREE.Color(0x7b00ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vPosition = position;
                
                // Add some movement to vertices
                vec3 newPosition = position;
                newPosition.x += sin(position.z * 10.0 + time) * 0.1;
                newPosition.y += cos(position.x * 10.0 + time) * 0.1;
                newPosition.z += sin(position.y * 10.0 + time) * 0.1;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            
            void main() {
                // Create a holographic grid effect
                float grid = 0.05 * (
                    sin(vPosition.x * 10.0) +
                    sin(vPosition.y * 10.0) +
                    sin(vPosition.z * 10.0)
                );
                
                // Mix colors based on position and time
                vec3 color = mix(color1, color2, sin(vUv.x * 3.14 + time) * 0.5 + 0.5);
                
                // Add grid lines
                color += vec3(grid);
                
                // Add transparency based on angle to camera
                float opacity = 0.7 + 0.3 * sin(vUv.y * 3.14 + time);
                
                gl_FragColor = vec4(color, opacity);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00f0ff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 10;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update time uniform for shader
        material.uniforms.time.value += 0.01;
        
        // Rotate torus knot
        torusKnot.rotation.x += 0.003;
        torusKnot.rotation.y += 0.005;
        
        // Render scene
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    const bars = document.querySelectorAll('.bar');
    
    if (!menuToggle) return;
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Animate bars to form an X
        if (nav.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            
            // Add mobile menu styles
            nav.style.display = 'flex';
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.backgroundColor = 'rgba(5, 10, 24, 0.95)';
            nav.style.padding = '20px';
            nav.style.backdropFilter = 'blur(10px)';
            
            // Animate menu items
            const navItems = nav.querySelectorAll('li');
            navItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * index);
            });
        } else {
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
            
            // Hide menu after transition
            setTimeout(() => {
                if (!nav.classList.contains('active')) {
                    nav.style.display = '';
                }
            }, 300);
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                menuToggle.click();
            }
        });
    });
}

// Stat Counters Animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Set up intersection observer to trigger counting animation when stats are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'));
                
                // Animate counting
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = Math.floor(duration / countTo);
                
                const counter = setInterval(() => {
                    count++;
                    target.textContent = count;
                    
                    if (count >= countTo) {
                        clearInterval(counter);
                    }
                }, interval);
                
                // Unobserve after triggering
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe each stat number
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Form validation
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        let valid = true;
        const inputs = this.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                
                // Remove existing error messages
                const existingError = input.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                input.parentNode.appendChild(errorMsg);
            } else {
                input.classList.remove('error');
                const existingError = input.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
        });
        
        if (valid) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Message sent successfully! We will get back to you soon.';
            
            // Remove existing success message
            const existingSuccess = contactForm.querySelector('.success-message');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            contactForm.appendChild(successMsg);
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    successMsg.remove();
                }, 500);
            }, 5000);
        }
    });
    
    // Clear error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const existingError = this.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        });
    });
}