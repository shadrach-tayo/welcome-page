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

// code for clipboard copy
const linkSource = document.getElementById("link-source");
const linkToShare = "https://simbibot.com/welcome-page/";

linkSource.addEventListener("click", () => {
  const copiedMessage = document.getElementById("copy-message");
  navigator.clipboard
    .writeText(linkToShare)
    .then(() => {
      console.log("link copied");
      copiedMessage.classList.add("copied");
      setTimeout(() => {
        copiedMessage.classList.remove("copied");
      }, 2000);
    })
    .catch(e => {
      console.log("no permission to copy");
    });
});

$(document).ready(function() {
  $(".slider").bxSlider();
  let el = $("#dialog");

  // responsive nav logic starts
  const navbar = $(".navbar");

  $(".nav-button").click(function() {
    if (navbar.hasClass("show")) {
      navbar.removeClass("show");
    } else {
      navbar.addClass("show");
    }
  });

  // responsive nav logic ends

  const documentBody = document.querySelector("body");
  const modalContainer = document.getElementById("modal-container");
  let activeModal = null;

  function openModal(modalName, modalTimeout) {
    if (activeModal) {
      clearTimeout(modalTimeout, openModal);
      return createModal(modalName);
    }

    const modal = document.getElementById(modalName);
    activeModal = modal;
    const closeBtn = modal.querySelector(".close-btn");

    console.log("modal ", closeBtn);
    documentBody.classList.add("modal-open");
    modal.classList.add("active");
    modalContainer.classList.add("active");

    // TODO
    // escape key should dismiss modal

    // close button should dismiss modal
    closeBtn.addEventListener(
      "click",
      e => {
        dismissModal();
      },
      { once: true }
    );

    // trap keyboard focus

    // clear modal timeout
    clearTimeout(modalTimeout, openModal);
  }

  function dismissModal() {
    if (!activeModal) return;
    activeModal.classList.remove("active");
    modalContainer.classList.remove("active");
    documentBody.classList.remove("modal-open");
    activeModal = null;
  }

  // openModal("modal-2");
  modalContainer.addEventListener("click", e => {
    if (e.target !== modalContainer) return;
    return dismissModal();
  });

  function createModal(modalName, time = 2000) {
    const modalTimeout = setTimeout(() => {
      openModal(modalName, modalTimeout);
    }, time);
  }

  createModal("modal-1", 20000);
  createModal("modal-2", 60000);
});
