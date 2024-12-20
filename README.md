<html lang="en">
<head>
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-TE3FHFGW3S"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	
	  gtag('config', 'G-TE3FHFGW3S');
	</script>
    
    <!-- Primary Meta Tags -->
    <title>Avnish Deshmukh - Robotics Enthusiast</title>
    <meta name="title" content="Avnish Deshmukh - Robotics Enthusiast">
    <meta name="description" content="Explore Avnish Deshmukh's journey in robotics, coding, and electronics. Discover innovative projects, insights, and experiences shared through tech-focused articles and showcases.">
    <meta name="keywords" content="Avnish Deshmukh, robotics, electronics, coding, projects, tech articles">
    <meta name="author" content="Avnish Deshmukh">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://Avnish2105.github.io/">
    <meta property="og:title" content="Avnish Deshmukh - Robotics Enthusiast">
    <meta property="og:description" content="Explore Avnish Deshmukh's journey in robotics, coding, and electronics. Discover innovative projects, insights, and experiences.">
    <meta property="og:image" content="https://avnish2105.github.io/profile_picture.jpeg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://Avnish2105.github.io/">
    <meta property="twitter:title" content="Avnish Deshmukh - Robotics Enthusiast">
    <meta property="twitter:description" content="Explore Avnish Deshmukh's journey in robotics, coding, and electronics. Discover innovative projects, insights, and experiences.">
    <meta property="twitter:image" content="https://avnish2105.github.io/profile_picture.jpeg">

    <!-- Favicon -->
    <link rel="icon" sizes="32x32" href="favicon-32x32.png" type="image/png">
    <link rel="icon" sizes="16x16" href="favicon-16x16.png" type="image/png">
    
    <style>
        /* General Styles */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            height: 120px;
            box-sizing: border-box;
        }

        h1, h2, h3 {
            margin: 0;
        }

        p {
            margin: 10px 0;
        }

        /* Flex Layout for Profile Section */
        .profile-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            margin: 20px;
        }

        .profile-container img {
            border-radius: 50%;
            width: 200px;
            height: 200px;
            margin: 10px;
            max-width: 100%;
            height: auto;
        }

        .profile-text {
            max-width: 600px;
            text-align: center;
            margin: 10px;
        }

        /* Journey Timeline */
        #journeyTimeline {
            position: relative;
            max-width: 100%;
            margin: 0 auto 40px;
            padding: 20px 20px 20px 30px;
            border-left: 4px solid #0078D4;
            background-color: #f9f9f9;
        }

        .timeline-event {
            margin: 20px 0;
            position: relative;
            padding-left: 60px;
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
        }

        .timeline-event > div {
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        .timeline-event h3 {
            color: #0078D4;
        }

        /* Social Links Section */
        #socialLinks {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 20px;
            margin-top: 20px;
        }

        .profile-box {
            border-radius: 12px;
            padding: 15px;
            flex: 1 1 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f8ff;
            transition: transform 0.3s;
            min-width: 250px;
        }

        .profile-box img {
            border-radius: 50%;
            margin-bottom: 10px;
            width: 48px;
            height: 48px;
        }

        .profile-link {
            text-decoration: none;
            color: white;
            padding: 5px 8px;
            border-radius: 8px;
            margin-top: 10px;
            display: inline-block;
        }

        /* Contact Button */
        .contact-button {
            display: inline-block;
            border-radius: 12px;
            background-color: #0078D4;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            transition: background-color 0.3s, transform 0.3s;
            margin: 60px 0 20px; /* Added margin for spacing */
        }

        .contact-button:hover {
            background-color: #005999;
            transform: scale(1.05);
        }

        /* Back-to-Top Button */
        #backToTopBtn {
            display: none;
            position: fixed;
            bottom: 40px;
            right: 40px;
            background-color: #333;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .profile-container {
                flex-direction: column;
            }

            .timeline-event {
                padding-left: 50px;
            }

            .timeline-event::before {
                left: -55px;
            }

            #socialLinks {
                flex-direction: column;
            }

            .profile-box {
                margin: 10px 0;
            }

            #backToTopBtn {
                padding: 8px 16px;
                font-size: 0.9em;
                bottom: 20px;
            }
        }

        @media (max-width: 480px) {
            .timeline-event {
                padding-left: 30px; /* Reduced padding for smaller screens */
            }

            .timeline-event::before {
                left: -30px; /* Adjust year label position */
                font-size: 0.8em; /* Smaller font size for mobile */
            }

            .timeline-event > div {
                padding: 10px; /* Adjust padding */
            }
        }
    </style>
</head>
<body>

<!-- Profile Section -->
<div class="profile-container" style="text-align: center; margin-top: 20px;">
    <img id="profilePicture" src="./profile_picture.jpeg" alt="Avnish Deshmukh" style="width: 200px; height: auto; transform: scale(0); transition: transform 0.5s ease-in-out;" />
    <div class="profile-text">
        <h2 style="color: #0078D4;">Hi! I am Avnish Deshmukh.</h2>
        <p>
		A robotics enthusiast and tech team member at MTT ROBOCON, I'm passionate about electronics, coding, and mechanical design. I enjoy tackling complex problems and advancing technology. Welcome to my site, where I share my projects, experiences, and insights—from robotics to beyond!
        </p>
    </div>
</div>

<script>
    // Wait for the image to load before scaling it
    window.onload = function() {
        const img = document.getElementById('profilePicture');
        img.style.transform = 'scale(1)'; // Zoom in the image
    };
</script>

<div class="logo-slider-wrapper">
    <div class="logo-slider-container">
        <div class="logo-slider">
            <div class="logo-group">
		    <img src="./logos/logo1.png" alt="Logo 1">
		    <img src="./logos/logo2.png" alt="Logo 2">
		    <img src="./logos/logo3.png" alt="Logo 3">
		    <img src="./logos/logo4.png" alt="Logo 4">
		    <img src="./logos/logo5.png" alt="Logo 5">
		    <img src="./logos/logo6.png" alt="Logo 6">
		    <img src="./logos/logo7.png" alt="Logo 7">
		    <img src="./logos/logo8.png" alt="Logo 8">
		    <img src="./logos/logo9.png" alt="Logo 9">
		    <img src="./logos/logo10.png" alt="Logo 10">
		    <img src="./logos/logo11.png" alt="Logo 11">
		    <img src="./logos/logo12.png" alt="Logo 12">
		    <img src="./logos/logo13.png" alt="Logo 13">
		    <img src="./logos/logo14.png" alt="Logo 14">
		    <img src="./logos/logo15.png" alt="Logo 15">
		    <img src="./logos/logo16.png" alt="Logo 16">
		    <img src="./logos/logo17.png" alt="Logo 17">
		    <img src="./logos/logo18.png" alt="Logo 18">
		    <img src="./logos/logo19.png" alt="Logo 19">
		    <img src="./logos/logo20.png" alt="Logo 20">
		    <img src="./logos/logo21.png" alt="Logo 21">
		    <img src="./logos/logo22.png" alt="Logo 22">
		    <img src="./logos/logo23.png" alt="Logo 23">
            </div>
		    <div class="logo-group">
		    <img src="./logos/logo1.png" alt="Logo 1">
		    <img src="./logos/logo2.png" alt="Logo 2">
		    <img src="./logos/logo3.png" alt="Logo 3">
		    <img src="./logos/logo4.png" alt="Logo 4">
		    <img src="./logos/logo5.png" alt="Logo 5">
		    <img src="./logos/logo6.png" alt="Logo 6">
		    <img src="./logos/logo7.png" alt="Logo 7">
		    <img src="./logos/logo8.png" alt="Logo 8">
		    <img src="./logos/logo9.png" alt="Logo 9">
		    <img src="./logos/logo10.png" alt="Logo 10">
		    <img src="./logos/logo11.png" alt="Logo 11">
		    <img src="./logos/logo12.png" alt="Logo 12">
		    <img src="./logos/logo13.png" alt="Logo 13">
		    <img src="./logos/logo14.png" alt="Logo 14">
		    <img src="./logos/logo15.png" alt="Logo 15">
		    <img src="./logos/logo16.png" alt="Logo 16">
		    <img src="./logos/logo17.png" alt="Logo 17">
		    <img src="./logos/logo18.png" alt="Logo 18">
		    <img src="./logos/logo19.png" alt="Logo 19">
		    <img src="./logos/logo20.png" alt="Logo 20">
		    <img src="./logos/logo21.png" alt="Logo 21">
		    <img src="./logos/logo22.png" alt="Logo 22">
		    <img src="./logos/logo23.png" alt="Logo 23">
            </div>
        </div>
    </div>
</div>

<style>
	body {
	    margin: 0;
	    padding: 0;
	    overflow-x: hidden; /* Prevent horizontal scroll */
	}
	
	.logo-slider-container {
	    width: 100vw; /* Full viewport width */
	    overflow: hidden;
	    margin: 0;
	    padding: 0;
	    position: absolute; /* Keep in document flow */
	    left: 0;
	}
	
	.logo-slider {
	    display: flex;
	    flex-wrap: nowrap; /* Prevents wrapping */
	    animation: scroll 40s linear infinite; /* Adjust duration as needed */
	    gap: 20px; /* Ensure there's space between logo groups */
	}
	
	.logo-slider img {
	    width: auto; /* Let width adjust based on height */
	    height: 80px; /* Fixed height */
	    border-radius: 15px;
	    object-fit: contain; /* Maintain aspect ratio */
	}
	
	.logo-group {
	    display: flex;
	    gap: 20px; /* Adjust spacing as needed */
	    flex-shrink: 0; /* Prevent images from shrinking */
	}
	
	/* For smaller screens */
	@media (max-width: 768px) {
	    .logo-slider img {
	        height: 50px; /* Smaller height for mobile */
	    }
	    .logo-group {
	        gap: 10px; /* Reduce spacing on smaller screens */
	    }
	    .logo-slider {
	        gap: 10px; /* Adjust the overall gap */
	    }
	}
	
	@keyframes scroll {
	    0% {
	        transform: translateX(0);
	    }
	    100% {
	        transform: translateX(-200%); /* Scroll the entire width of the combined content */
	    }
	}

</style>

<div id="journeyTimeline" style="max-width: 800px; margin-top: 200px;">
    <h2 style="text-align: center; color: #0078D4;">My Journey</h2>

    <!-- Timeline Events -->
    <div class="timeline-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 0; transform: translateY(30px);">
        <div style="flex: 1; min-width: 120px;">
            <h3>Born</h3>
            <p>2005</p>
        </div>
    </div>

    <div class="timeline-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 0; transform: translateY(30px);">
        <div style="flex: 1; min-width: 120px;">
            <h3>Completed 10th Grade</h3>
            <p>Stella Maris School<br>2022</p>
        </div>
    </div>

    <div class="timeline-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 0; transform: translateY(30px);">
        <div style="flex: 1; min-width: 120px;">
            <h3>Started Diploma & Joined MIT Tech Team</h3>
            <p>MIT World Peace University<br>2022</p>
        </div>
    </div>

    <div class="timeline-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 0; transform: translateY(30px);">
        <div style="flex: 1; min-width: 120px;">
            <h3>Participated in DD Robocon Air 4</h3>
            <p>2022</p>
        </div>
    </div>

    <div class="timeline-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 0; transform: translateY(30px);">
        <div style="flex: 1; min-width: 120px;">
            <h3>Participated in DD Robocon Air 2</h3>
            <p>2023</p>
        </div>
    </div>

    <div class="timeline-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 0; transform: translateY(30px);">
        <div style="flex: 1; min-width: 120px;">
            <h3>Started with ROS2</h3>
            <p>Participated in DD Robocon Air 3<br>2024</p>
        </div>
    </div>

	<div class="timeline-event moving-event" style="display: flex; flex-wrap: wrap; margin: 10px 0; opacity: 1; transform: translateY(30px); color: #ff4500;">
	    <div style="flex: 1; min-width: 120px; color: #ff4500;">
		<h3 style="color: #ff4500;">Aiming for DD Robocon Air 1</h3>
		<p>2025</p>
	    </div>
	</div>
</div>

<style>
    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .timeline-event {
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }

    .visible {
        animation: fadeInUp 0.5s forwards;
    }

    .moving-event {
        animation: bounce 1s infinite;
        color: #FF4500; /* Change to an eye-catching color, like orange-red */
        font-weight: bold; /* Make it bold */
    }
</style>

<script>
    document.addEventListener('scroll', function() {
        const elements = document.querySelectorAll('.timeline-event');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('visible');
            }
        });
    });
</script>

    <!-- Social Links Section -->
    <div id="socialLinks">
        <!-- LinkedIn Profile Box -->
        <div class="profile-box" style="border: 2px solid #0A66C2;">
            <img src="https://img.icons8.com/color/48/000000/linkedin-circled.png" alt="LinkedIn Logo">
            <h3>Avnish Deshmukh</h3>
            <p> Tech team member at MIT Tech Team (electronics & ros)</p>
            <a href="https://www.linkedin.com/in/avnish-deshmukh" class="profile-link" style="background-color: #0A66C2;">View LinkedIn</a>
        </div>


        <!-- GitHub Profile Box -->
        <div class="profile-box" style="border: 2px solid #181717;">
            <img src="https://img.icons8.com/material-rounded/48/000000/github.png" alt="GitHub Logo">
            <h3>Avnish Deshmukh</h3>
            <p>Robotics Enthusiast & Tech Innovator | Exploring code and hardware</p>
            <a href="https://github.com/avnish2105" class="profile-link" style="background-color: #181717;">View GitHub</a>
        </div>

        <!-- Instagram Profile Box -->
        <div class="profile-box" style="border: 2px solid #E4405F;">
            <img src="https://img.icons8.com/color/48/000000/instagram-new--v1.png" alt="Instagram Logo">
            <h3>Avnish Deshmukh</h3>
            <p>Follow my journey through tech, adventures, and everything in between.!</p>
            <a href="https://www.instagram.com/av.nish2105/" class="profile-link" style="background-color: #E4405F;">View Instagram</a>
        </div>
    </div>

    <!-- Contact Button -->
    <div style="text-align: center;">
        <br><br> <!-- Added space -->
        <a href="mailto:avnishd2105@gmail.com" class="contact-button">Contact Me</a>
    </div>

	<!-- Back to Top Button -->
	<button id="backToTopBtn" onclick="scrollToTop()" style="display: none; border: none; background: transparent; cursor: pointer;">
	    <i class="fas fa-arrow-up" style="font-size: 30px; color: #333;"></i>
	</button>
	
	<script>
	    // Scroll-to-Top Function
	    function scrollToTop() {
	        window.scrollTo({ top: 0, behavior: 'smooth' });
	    }
	
	    // Display back-to-top button when scrolling
	    window.onscroll = function () {
	        const button = document.getElementById('backToTopBtn');
	        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
	            button.style.display = 'block';
	        } else {
	            button.style.display = 'none';
	        }
	    };
	</script>
	
	<!-- Include Font Awesome CDN -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">


	<div id="cursor-trail"></div>
	
	<style>
	#cursor-trail {
	    position: fixed;
	    width: 10px;
	    height: 10px;
	    border-radius: 50%;
	    background-color: #ff4500;
	    pointer-events: none;
	    transform: translate(-50%, -50%);
	    z-index: 1000;
	}
	</style>
	
	<script>
	document.addEventListener('mousemove', function(e) {
	    let cursorTrail = document.getElementById('cursor-trail');
	    cursorTrail.style.left = e.clientX + 'px';
	    cursorTrail.style.top = e.clientY + 'px';
	});
	</script>

</body>
</html>
