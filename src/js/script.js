//* Mobile nav bar
const useMobileNav = () => {
	const burgerButton = document.querySelector(".burger__icon");
	const nav = document.querySelector(".header__nav");

	// Toggle mobile nav visability
	const toggleNav = () => {
		const viewWidth = window.innerWidth;

		if (viewWidth <= 768) {
			nav.classList.toggle("header__nav_open");

			// Changing body overflow style for scroll lock
			const bodyStyles = document.body.style;

			bodyStyles.overflow
				? (bodyStyles.overflow = "")
				: (bodyStyles.overflow = "hidden");
		}
	};

	// Toggle burger icon
	const toggleBurger = () => {
		burgerButton.classList.toggle("burger__icon_active");
	};

	burgerButton.addEventListener("click", () => {
		toggleBurger();
		toggleNav();
	});

	// Auto close after clicking on navigation links
	nav.addEventListener("click", (event) => {
		const target = event.target;

		if (!target.classList.contains("nav")) {
			toggleBurger();
			toggleNav();
		}
	});
};

const useAccordion = () => {
	const wrapper = document.querySelector(".faq__content");
	const accordions = document.querySelectorAll(".accordion");

	const toggleAttributes = (header, content, expanded, hidden) => {
		header.setAttribute("aria-expanded", expanded);
		content.setAttribute("aria-hidden", hidden);
	};

	const toggleClass = (accordion, action) => {
		switch (action) {
			case "add":
				accordion.classList.add("accordion_open");
				break;
			case "remove":
				accordion.classList.remove("accordion_open");
				break;
			default:
				break;
		}
	};

	wrapper.addEventListener("click", (event) => {
		const target = event.target;
		const accordion = target.parentNode;
		const content = target.parentNode.querySelector(".accordion__content");

		if (target.classList.contains("accordion__header")) {
			if (accordion.classList.contains("accordion_open")) {
				return toggleClass(accordion, "remove");
			}

			accordions.forEach((accordion) => {
				const header = accordion.querySelector(".accordion__header");
				const content = accordion.querySelector(".accordion__content");

				toggleClass(accordion, "remove");
				toggleAttributes(header, content, false, true);
			});

			toggleClass(accordion, "add");
			toggleAttributes(target, content, true, false);
		}
	});
};

window.addEventListener("DOMContentLoaded", () => {
	useMobileNav();

	useAccordion();

	const clientsSlider = new Swiper(".clients__slider", {
		direction: "horizontal",
		spaceBetween: 20,
		slidesOffsetAfter: 20,
		slidesPerView: 2.2,
		breakpoints: {
			320: {
				slidesPerView: 1.1,
				spaceBetween: 20,
			},
			425: {
				slidesPerView: 1.3,
				spaceBetween: 20,
				slidesOffsetAfter: 30,
				centeredSlides: true,
			},
			768: {
				slidesPerView: 2.2,
				centeredSlides: false,
			},
		},
		navigation: {
			nextEl: ".clients__button-next",
			prevEl: ".clients__button-prev",
		},
	});
});
