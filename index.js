function scrollIt(destination, duration = 200, easing = "linear", callback) {
  // object with some timing functions
  const easings = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    }
  };

  // function body here
  const start = window.pageYOffset;
  const startTime =
    "now" in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  const windowHeight =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.getElementsByTagName("body")[0].clientHeight;
  const destinationOffset =
    typeof destination == "number" ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(
    documentHeight - destinationOffset < windowHeight
      ? documentHeight - windowHeight
      : destinationOffset
  );

  if ("requestAnimationFrame" in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    console.log("scrolled To: ", pageYOffset);
    const now =
      "now" in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, (now - startTime) / duration);
    const timeFunction = easings[easing](time);
    window.scroll(
      0,
      Math.ceil(timeFunction * destinationOffsetToScroll - start) + start
    );

    if (
      window.pageYOffset === destinationOffsetToScroll ||
      destinationOffsetToScroll - pageYOffset <= 1
    ) {
      if (callback) callback();
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}

const transitionElms = [...document.querySelectorAll("[data-transition]")];

if ("IntersectionObserver" in window) {
  let animationObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let node = entry.target;
        console.log("entring ", node);
        node.style.transition = ".5s ease-in";
        node.classList.remove(node.dataset.transition);
        animationObserver.unobserve(node);
      }
    });
  });

  transitionElms.forEach(el => {
    animationObserver.observe(el);
  });
} else {
  transitionElms.forEach(node => {
    node.style.transition = ".5s ease-in";
    node.classList.remove(node.dataset.transition);
  });
}

let link = document.querySelector("#learn-more");
const el = document.getElementById("more");
link.addEventListener("click", () =>
  scrollIt(el, 400, "easeInQuad", () => console.log("done scrolling"))
);

$(document).ready(function() {
  $(".slider").bxSlider();
});
