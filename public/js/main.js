

/*-------------- navigation menu ----------------*/

(() =>{

    const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click",showNavMenu)
    closeNavBtn.addEventListener("click",hideNavMenu)

    function showNavMenu(){
        navMenu.classList.add("open")
        bodyScrollingToggle();
    }
    function hideNavMenu(){
        navMenu.classList.remove("open")
        fadeOutEffect();
        bodyScrollingToggle();
    }
    function fadeOutEffect(){
        document.querySelector(".fade-out-effect").classList.add("active")
        setTimeout(() =>{
        document.querySelector(".fade-out-effect").classList.remove("active")
        },300)
    }
    //attach an event handler to document
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains('link-item')){
            /* make sure event.target.hash has a value before overridding default behaviour */
            if(event.target.hash !== ""){
                // prevent default anchor click behaviour
                event.preventDefault();
                const hash = event.target.hash;
                // deactivate existing active 'section'
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");
                // activate new 'section'
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");
                /* deactivate existing active navigation menu 'link-item' */
                navMenu.querySelector(".active").classList.add("outer-shadow","hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active","inner-shadow");

                // if clicked 'link - item' is contained within the navigation menu
                if(navMenu.classList.contains("open")){
                    /* activate new navigation menu 'link-item' */
                    event.target.classList.add("active","inner-shadow");
                    event.target.classList.remove("outer-shadow","hover-in-shadow");
                    // hide navigation menu
                    hideNavMenu();
                }
                else{
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) =>{
                        if(hash === item.hash){
                            // activate new navigation menu 'link-item'
                            item.classList.add("active","inner-shadow");
                            item.classList.remove("outer-shadow","hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                // add hash (#) to url
                window.location.hash = hash
            }
        }
    })

})();

/*------------- about section tabs --------------*/

(() =>{
    const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) => {
        /* if event.target contains 'tab-item' class and not contains 'active' class */ 
        if(event.target.classList.contains("tab-item") && !event.target.classList.contains("active")){
            const target = event.target.getAttribute("data-target");
            // deactivate exixting active 'tab-item'
            tabsContainer.querySelector(".active").classList.remove("outer-shadow","active");
            //activate new 'tab-item'
            event.target.classList.add("active","outer-shadow");
            // deactivate exixting active 'tab-content'
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            //activate new 'tab-content'
            aboutSection.querySelector(target).classList.add("active");
        }
    })
})();

function bodyScrollingToggle(){
    document.body.classList.toggle("stop-scrolling");
}

/*-------------- portfolio filter and popup -----------------*/

(() =>{
    const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item");
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    /* filter portfolio items */
    filterContainer.addEventListener("click", (event)=>{
        if(event.target.classList.contains("filter-item") && !event.target.classList.contains("active")){
            // deactivate existing active 'filter-item'
            filterContainer.querySelector(".active").classList.remove("outer-shadow","active");
            // activate new 'filter item'
            event.target.classList.add("active","outer-shadow");
            const target = event.target.getAttribute("data-target");
            // console.log(target);
            portfolioItems.forEach((item) =>{
                if(target === item.getAttribute("data-category") || target === 'all'){
                    item.classList.remove("hide");
                    item.classList.add("show");
                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".portfolio-item-inner")){
            const portfolioItem =event.target.closest(".portfolio-item-inner").parentElement;
            //get the portfolioItem index
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");
            // convert screenshots into array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display="none";
                nextBtn.style.display="none";
            }
            else{
                prevBtn.style.display="block";
                nextBtn.style.display="block";
            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle() {
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        /* activate loader until the popupImg loaded */
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src=imgSrc;
        popupImg.onload = () =>{
            // deactivate loader after the popupImg loader
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

    // next slide
    nextBtn.addEventListener("click", () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
    })

    // prev slide
    prevBtn.addEventListener("click", () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length-1;
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })

    function popupDetails(){
        // if portfolio item details not exist
        if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
            projectDetailsBtn.style.display="none";
            return; /* end funvtion execution */
        }
        projectDetailsBtn.style.display="block";
        // get the project details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        // set the project details
        popup.querySelector(".pp-project-details").innerHTML = details;
        // get the project title
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        // set the project title
        popup.querySelector(".pp-title h2").innerHTML = title;
        // get the project category
        const category = portfolioItems[itemIndex].getAttribute("data-category");
        // console.log(category);
        // set the project category
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    } 

    // popup details
    projectDetailsBtn.addEventListener("click",() =>{
        popupDetailsToggle();
    })
    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        }
        else{
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0,projectDetailsContainer.offsetTop);
        }
    }

})();

/*----------------------- Testimonial slider -------------------------*/
(() =>{
    const sliderContainer = document.querySelector(".testi-slider-container"),
    slides = sliderContainer.querySelectorAll(".testi-item"),
    slideWidth = sliderContainer.offsetWidth,
    prevBtn = document.querySelector(".testi-slider-nav .prev"),
    nextBtn = document.querySelector(".testi-slider-nav .next"),
    activeSlide = sliderContainer.querySelector(".testi-item.active");
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);

    // set width of all slides
    slides.forEach((slide)=>{
        slide.style.width = slideWidth + "px";
    })
    // set width of all sliderContainer
    sliderContainer.style.width = slideWidth * slides.length + "px";

    nextBtn.addEventListener("click",() =>{
        if (slideIndex === slides.length-1){
            slideIndex = 0;            
        }
        else{
            slideIndex++;
        }
        slider(); 
    })

    prevBtn.addEventListener("click",() =>{
        if (slideIndex === 0){
            slideIndex = slides.length-1;            
        }
        else{
            slideIndex--;
        } 
        slider();       
    })

    function slider(){
        // daectivate existing active slides
        sliderContainer.querySelector(".testi-item.active").classList.remove("active");
        // activate new slide 
        slides[slideIndex].classList.add("active");
        sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";
    }
    slider();

})();

/*----------------- hide all sections execpt active -----------------*/

(() =>{

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) =>{
        if(!section.classList.contains("active")){
            section.classList.add("hide");
        }
    })

})();


window.addEventListener("load", () =>{
    // preloader
    document.querySelector(".preloader").classList.add("fade-out");

    setTimeout(() =>{
    document.querySelector(".preloader").style.display="none";
    },600)
})


/* -------------------top sldr -------------------------- */

/* *********** About section********** */
const backToTopButton1 = document.querySelector("#back-to-top-btn1");

window.addEventListener("scroll", scrollFunction1);

function scrollFunction1() {
  if (window.pageYOffset > 300) { // Show backToTopButton1
    if(!backToTopButton1.classList.contains("btnEntrance")) {
      backToTopButton1.classList.remove("btnExit");
      backToTopButton1.classList.add("btnEntrance");
      backToTopButton1.style.display = "block";
    }
  }
  else { // Hide backToTopButton1
    if(backToTopButton1.classList.contains("btnEntrance")) {
      backToTopButton1.classList.remove("btnEntrance");
      backToTopButton1.classList.add("btnExit");
      setTimeout(function() {
        backToTopButton1.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton1.addEventListener("click", smoothScrollBackToTop1);

// function backToTop() {
//   window.scrollTo(0, 0);
// }

function smoothScrollBackToTop1() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic1(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic1(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};


/* *********** Service section********** */

const backToTopButton2 = document.querySelector("#back-to-top-btn2");

window.addEventListener("scroll", scrollFunction2);

function scrollFunction2() {
  if (window.pageYOffset > 300) { // Show backToTopButton2
    if(!backToTopButton2.classList.contains("btnEntrance")) {
      backToTopButton2.classList.remove("btnExit");
      backToTopButton2.classList.add("btnEntrance");
      backToTopButton2.style.display = "block";
    }
  }
  else { // Hide backToTopButton2
    if(backToTopButton2.classList.contains("btnEntrance")) {
      backToTopButton2.classList.remove("btnEntrance");
      backToTopButton2.classList.add("btnExit");
      setTimeout(function() {
        backToTopButton2.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton2.addEventListener("click", smoothScrollBackToTop2);

// function backToTop() {
//   window.scrollTo(0, 0);
// }

function smoothScrollBackToTop2() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic2(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic2(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};

/* *********** potfolio section********** */


const backToTopButton3 = document.querySelector("#back-to-top-btn3");

window.addEventListener("scroll", scrollFunction3);

function scrollFunction3() {
  if (window.pageYOffset > 300) { // Show backToTopButton3
    if(!backToTopButton3.classList.contains("btnEntrance")) {
      backToTopButton3.classList.remove("btnExit");
      backToTopButton3.classList.add("btnEntrance");
      backToTopButton3.style.display = "block";
    }
  }
  else { // Hide backToTopButton3
    if(backToTopButton3.classList.contains("btnEntrance")) {
      backToTopButton3.classList.remove("btnEntrance");
      backToTopButton3.classList.add("btnExit");
      setTimeout(function() {
        backToTopButton3.style.display = "none";
      }, 250);
    }
  }
}

backToTopButton3.addEventListener("click", smoothScrollBackToTop3);

// function backToTop() {
//   window.scrollTo(0, 0);
// }

function smoothScrollBackToTop3() {
  const targetPosition = 0;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 750;
  let start = null;
  
  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    window.scrollTo(0, easeInOutCubic3(progress, startPosition, distance, duration));
    if (progress < duration) window.requestAnimationFrame(step);
  }
}

function easeInOutCubic3(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};