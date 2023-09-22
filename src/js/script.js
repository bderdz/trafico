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

window.addEventListener("DOMContentLoaded", () => {
	useMobileNav();

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
				slidesPerView: 1.7,
				spaceBetween: 30,
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
