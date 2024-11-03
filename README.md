<!-- Navigation Bar -->
<nav style="
    display: flex; 
    justify-content: center; 
    gap: 20px; 
    padding: 15px 20px; 
    background-color: #2e3d49; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
">
    <a href="#about" style="
        color: #f0f0f0; 
        text-decoration: none; 
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.3s, color 0.3s;
    ">About</a>

    <a href="#skills" style="
        color: #f0f0f0; 
        text-decoration: none; 
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.3s, color 0.3s;
    ">Skills</a>

    <a href="#journey" style="
        color: #f0f0f0; 
        text-decoration: none; 
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.3s, color 0.3s;
    ">Journey</a>

    <a href="#contact" style="
        color: #f0f0f0; 
        text-decoration: none; 
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.3s, color 0.3s;
    ">Contact</a>
</nav>

<style>
    /* Smooth scrolling for entire page */
    html {
        scroll-behavior: smooth;
    }

    /* Hover Effect for Links */
    nav a:hover {
        background-color: #4a5967;
        color: #fff;
    }

    /* Active State for Links */
    nav a:active {
        background-color: #1e2a34;
    }
</style>

<script>
    // JavaScript for smooth scrolling when links are clicked
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default jump behavior
            const targetId = this.getAttribute('href').substring(1); // Get ID without '#'
            const targetElement = document.getElementById(targetId);

            // Scroll smoothly to the target section
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    });
</script>

<div style="text-align: initial;">
    <h1>👋 Hi! I am Avnish Deshmukh</h1>
</div>

<!-- Toggle Mode Button -->
<button id="modeToggle" style="position: fixed; top: 20px; right: 20px; background: none; border: none; cursor: pointer;">
    <img id="modeIcon" src="https://img.icons8.com/ios-filled/50/ffffff/moon-symbol.png" alt="Toggle Mode" style="width: 30px; height: 30px; border-radius: 50%; background-color: #555; padding: 5px;">
</button>

<script>
    // Initially set to dark mode
    document.body.classList.add('dark-mode');

    const toggle = document.getElementById('modeToggle');
    const modeIcon = document.getElementById('modeIcon');

    // Toggle dark mode on button click and switch the icon
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            modeIcon.src = "https://img.icons8.com/ios-filled/50/ffffff/moon-symbol.png"; // Moon icon for dark mode
        } else {
            modeIcon.src = "https://img.icons8.com/ios-filled/50/333333/sun--v1.png"; // Sun icon for light mode
        }
    });
</script>

<style>
    /* Dark mode styles */
    .dark-mode {
        background-color: #333;
        color: #f0f0f0;
    }
    .dark-mode a {
        color: #f0f0f0;
    }
    /* Light mode styles */
    a {
        color: #333;
    }
</style>

<div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; margin: 20px 0;">
    <img src="./profile_picture.jpeg" alt="Profile Picture" style="border-radius: 50%; width: 200px; height: 200px; margin: 10px;">
    <div style="max-width: 600px; text-align: center;">
        <h2>Robotics Enthusiast & Tech Innovator</h2>
        <p>
            A 🤖 robotics enthusiast, tech team member at MTT ROBOCON, and a dedicated learner passionate about 🔧 electronics, 💻 coding, and 🛠️ mechanical design. 
            I love solving complex problems and pushing the boundaries of technology. Living with ⚡ epilepsy has taught me resilience and has been an integral 
            part of my journey, shaping who I am today. Welcome to my personal website, where I share my projects, experiences, and insights from the world of 
            robotics and beyond! 🚀
        </p>
    </div>
</div>

<!-- Back-to-Top Button -->
<button id="backToTopBtn" style="display: none; position: fixed; bottom: 40px; right: 40px; background-color: #333; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; z-index: 1000;">Back to Top</button>

<script>
    // Get the button
    var backToTopBtn = document.getElementById("backToTopBtn");

    // Show the button when scrolling down 100px from the top of the document
    window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    };

    // Scroll to the top of the page when the button is clicked
    backToTopBtn.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
</script>

## Skills

### ⚡ Electronics and Circuit Design
<img src="https://img.shields.io/badge/Electronics-FF6F00?style=for-the-badge&logo=arduino&logoColor=white" style="border-radius: 12px;">

Joined the MIT Tech team in 2022 and spent two years developing expertise in electronics. Learned circuit design, debugging techniques, and now enjoy building robots and spending time perfecting them through thorough troubleshooting.

### 🤖 Robot Operating System (ROS2)
<img src="https://img.shields.io/badge/ROS2-22314E?style=for-the-badge&logo=ros&logoColor=white" style="border-radius: 12px;">

In 2024, I transitioned to the control department and worked extensively with ROS2, collaborating with my team on implementing various hardware interfaces and mastering ROS2 fundamentals.

### 🛠️ Project Management

<img src="https://img.shields.io/badge/Project%20Management-0078D4?style=for-the-badge&logo=microsoftteams&logoColor=white" style="border-radius: 12px;">
Learned and applied multiple project management systems, such as agile sprints, through observation and direct implementation. I continue enhancing my skills with experiences, research papers, and guidance from alumni.

<!-- Journey Timeline -->
<div id="journeyTimeline" style="position: relative; max-width: 600px; margin: auto; padding: 20px; border-left: 4px solid #0078D4; background-color: #f9f9f9;">
    <h2 style="text-align: center; color: #0078D4;">My Journey</h2>
    
    <!-- Timeline Events -->
    <div class="timeline-event" data-year="2005">
        <h3>Born</h3>
        <p>2005</p>
    </div>
    
    <div class="timeline-event" data-year="2021">
        <h3>Completed 10th Grade</h3>
        <p>Stella Maris School</p>
    </div>

    <div class="timeline-event" data-year="2022">
        <h3>Started Diploma & Joined MIT Tech Team</h3>
        <p>Participated in DD Robocon Air 4<br>MIT World Peace University</p>
    </div>

    <div class="timeline-event" data-year="2023">
        <h3>Participated in DD Robocon Air 2</h3>
        <p>2023</p>
    </div>

    <div class="timeline-event" data-year="2024">
        <h3>Started with ROS2</h3>
        <p>Participated in DD Robocon Air 3<br>2024</p>
    </div>

    <div class="timeline-event bounce" data-year="2025" style="--color: #FF6F00;">
        <h3>Aiming for DD Robocon Air 1</h3>
        <p>2025</p>
    </div>
</div>

<!-- Dark Mode & Timeline Styles -->
<style>
    /* Base Styles for Timeline */
    #journeyTimeline {
        border-left: 4px solid #0078D4;
        background-color: #f9f9f9;
        padding: 20px;
    }

    #journeyTimeline h2 {
        color: #0078D4;
    }

    .timeline-event {
        margin: 20px 0;
        position: relative;
        padding-left: 50px;
    }

    .timeline-event::before {
        content: attr(data-year);
        font-weight: bold;
        color: #0078D4;
        position: absolute;
        left: -70px;
        top: 0;
        font-size: 0.9em;
    }

    .timeline-event::after {
        content: '';
        position: absolute;
        left: -7px;
        top: 0;
        width: 16px;
        height: 16px;
        background-color: #0078D4;
        border-radius: 50%;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }

    .timeline-event > div {
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        margin-left: 30px;
    }

    .timeline-event h3 {
        margin: 0;
        color: #0078D4;
    }

    /* Dark Mode Styles */
    .dark-mode #journeyTimeline {
        background-color: #2c3e50;
        border-left-color: #ffffff;
    }

    .dark-mode #journeyTimeline h2 {
        color: #ffffff;
    }

    .dark-mode .timeline-event::before {
        color: #ffffff;
    }

    .dark-mode .timeline-event::after {
        background-color: #ffffff;
    }

    .dark-mode .timeline-event > div {
        background-color: #34495e;
        color: #ecf0f1;
    }

    .dark-mode .timeline-event h3 {
        color: #ecf0f1;
    }

    /* Special bounce event */
    .timeline-event.bounce::before,
    .timeline-event.bounce::after {
        color: var(--color, #FF6F00);
        background-color: var(--color, #FF6F00);
    }

    /* Bounce Animation */
    @keyframes bounce {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-5px);
        }
    }

    .timeline-event.bounce {
        animation: bounce 1s infinite alternate;
    }
</style>

<script>
    // Dark mode toggle logic
    const toggleButton = document.getElementById('modeToggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
</script>

<!-- Social Links Section -->
<div id="socialLinks" style="display: flex; justify-content: space-between; gap: 20px; margin-top: 20px;">
    <!-- LinkedIn Profile Box -->
    <div class="profile-box" style="border: 2px solid #0A66C2;">
        <img src="https://img.icons8.com/color/48/000000/linkedin-circled.png" alt="LinkedIn Logo" class="profile-logo">
        <div style="text-align: center;">
            <h3>Avnish Deshmukh</h3>
            <p>Robotics Enthusiast & Tech Innovator | Electronics | ROS2 | Project Management</p>
            <a href="https://www.linkedin.com/in/avnish-deshmukh" class="profile-link" style="background-color: #0A66C2;">View LinkedIn</a>
        </div>
    </div>

    <!-- GitHub Profile Box -->
    <div class="profile-box" style="border: 2px solid #181717;">
        <img src="https://img.icons8.com/material-rounded/48/000000/github.png" alt="GitHub Logo" class="profile-logo">
        <div style="text-align: center;">
            <h3>Avnish Deshmukh</h3>
            <p>Robotics Enthusiast & Tech Innovator | Exploring code and hardware</p>
            <a href="https://github.com/avnishd2105" class="profile-link" style="background-color: #181717;">View GitHub</a>
        </div>
    </div>

    <!-- Instagram Profile Box -->
    <div class="profile-box" style="border: 2px solid #E4405F;">
        <img src="https://img.icons8.com/color/48/000000/instagram-new.png" alt="Instagram Logo" class="profile-logo">
        <div style="text-align: center;">
            <h3>Avnish Deshmukh</h3>
            <p>Capturing moments & sharing my journey in tech and robotics</p>
            <a href="https://www.instagram.com/av.nish2105/" class="profile-link" style="background-color: #E4405F;">View Instagram</a>
        </div>
    </div>
</div>

<!-- Dark Mode Styles -->
<style>
    /* Base Profile Box Styles */
    .profile-box {
        border-radius: 12px;
        padding: 15px;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f0f8ff;
        transition: transform 0.3s, background-color 0.3s, color 0.3s;
    }

    /* Hover Scale Effect */
    .profile-box:hover {
        transform: scale(1.02);
    }

    /* Logo Styling */
    .profile-logo {
        border-radius: 50%;
        margin-bottom: 10px;
    }

    /* Profile Link Button Styling */
    .profile-link {
        text-decoration: none;
        color: white;
        padding: 5px 8px;
        border-radius: 8px;
        font-size: 0.9em;
        margin-top: 10px;
        display: inline-block;
    }

    /* Dark Mode Styles */
    .dark-mode .profile-box {
        background-color: #2c3e50;
        color: #ecf0f1;
    }

    .dark-mode .profile-box h3,
    .dark-mode .profile-box p {
        color: #ecf0f1;
    }

    .dark-mode .profile-link {
        color: #ffffff;
    }

    /* Adjust icon backgrounds in dark mode */
    .dark-mode .profile-box:nth-child(1) {
        border-color: #0A66C2;
    }
    
    .dark-mode .profile-box:nth-child(2) {
        border-color: #ffffff; /* GitHub */
    }
    
    .dark-mode .profile-box:nth-child(3) {
        border-color: #E4405F;
    }
</style>

<script>
    // Dark mode toggle logic
    const toggleButton = document.getElementById('modeToggle');
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
</script>

<style>
    .contact-button {
        display: inline-block;
        border-radius: 12px;
        background-color: #0078D4; /* Button color */
        color: white; /* Text color */
        text-decoration: none; /* Remove underline from link */
        padding: 10px 20px; /* Padding for the button */
        transition: background-color 0.3s, transform 0.3s; /* Transition effects */
    }

    .contact-button:hover {
        background-color: #005999; /* Darker shade for hover */
        transform: scale(1.05); /* Slightly increase size on hover */
    }
</style>

## Contact Me
<a class="contact-button" href="mailto:avnishd2105@gmail.com">
    Contact Me
</a>

You can also reach me at [avnishd2105@gmail.com](mailto:avnishd2105@gmail.com).

<footer style="text-align: center; margin-top: 20px;">
    © 2024 Avnish Deshmukh | All rights reserved. | "Exploring technology, one project at a time."
</footer>
