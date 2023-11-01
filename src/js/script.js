//* Mobile nav bar
const mobileNav = () => {
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

//* Accordion component
const accordion = () => {
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

//* Form
const contactForm = () => {
	const form = document.querySelector("#contact-form"),
		name = document.querySelector("#contact__name"),
		email = document.querySelector("#contact__email"),
		success = document.querySelector(".form__success");

	const setValidationStatus = (input, message, isInvalid) => {
		const errorFiled = input.parentElement.querySelector(".form__error-message");
		errorFiled.innerHTML = message;

		if (isInvalid) {
			input.classList.add("form__input_invalid");
		} else {
			input.classList.remove("form__input_invalid");
		}
	};

	const validateField = (input, value) => {
		if (value.length === 0) {
			setValidationStatus(input, "Field cannot be empty", true);

			return false;
		}

		if (input.type === "email") {
			const emailRegex = /^[a-z0-9][a-z0-9._]+[a-z0-9]@[a-z0-9_.]+\.[a-z]{2,}$/;

			if (!emailRegex.test(value.toLowerCase())) {
				setValidationStatus(input, "Incorrect email address", true);

				return false;
			}
		}

		return true;
	};

	name.addEventListener("blur", (e) => {
		const target = e.target;

		validateField(target, target.value);
	});

	name.addEventListener("focus", (e) => {
		const target = e.target;

		setValidationStatus(target, "", false);
	});

	email.addEventListener("blur", (e) => {
		const target = e.target;

		validateField(target, target.value);
	});

	email.addEventListener("focus", (e) => {
		const target = e.target;

		setValidationStatus(target, "", false);
	});

	form.addEventListener("submit", (e) => {
		e.preventDefault();

		const nameValue = name.value;
		const emailValue = email.value;

		if (validateField(name, nameValue) && validateField(email, emailValue)) {
			console.log(`name: ${nameValue}\nemail: ${emailValue}`);

			form.reset();
			success.classList.add("form__success_active");

			setTimeout(() => {
				success.classList.remove("form__success_active");
			}, 3000);
		}
	});
};

window.addEventListener("DOMContentLoaded", () => {
	mobileNav();

	accordion();

	contactForm();

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

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

	if (ScrollTrigger.isTouch !== 1) {
		ScrollSmoother.create({
			wrapper: ".wrapper",
			content: ".content",
			smooth: 1.3,
			effects: true,
		});

		document.querySelectorAll("#nav__link").forEach((link) => {
			link.addEventListener("click", (event) => {
				event.preventDefault();

				const scrollTo = link.getAttribute("href");

				gsap.to(window, {
					duration: 1,
					delay: 0,
					ease: "power1.inOut",
					scrollTo: { y: scrollTo, offsetY: 50 },
				});
			});
		});

		gsap.fromTo(
			".hero__container",
			{ opacity: 1 },
			{
				opacity: 0,
				scrollTrigger: {
					trigger: ".hero__container",
					start: "center",
					end: "1100",
					scrub: true,
				},
			}
		);

		gsap.fromTo(
			".hero__truck",
			{ opacity: 0, x: -300 },
			{
				opacity: 1,
				x: 0,
				scrollTrigger: {
					trigger: ".hero__truck",
					start: "-1000",
					end: "-100",
					scrub: true,
				},
			}
		);

		gsap.fromTo(
			".hero__truck",
			{ opacity: 1 },
			{
				opacity: 0,
				scrollTrigger: {
					trigger: ".hero__truck",
					start: "200",
					end: "400",
					scrub: true,
				},
			}
		);

		const leftContent = gsap.utils.toArray(".left__content");

		leftContent.forEach((item) => {
			gsap.fromTo(
				item,
				{ opacity: 0, x: -100 },
				{
					opacity: 1,
					x: 0,
					scrollTrigger: {
						trigger: item,
						start: "-850",
						end: "-150",
						scrub: true,
					},
				}
			);
		});

		const rightContent = gsap.utils.toArray(".right__content");

		rightContent.forEach((item) => {
			gsap.fromTo(
				item,
				{ opacity: 0, x: 100 },
				{
					opacity: 1,
					x: 0,
					scrollTrigger: {
						trigger: item,
						start: "-850",
						end: "-150",
						scrub: true,
					},
				}
			);
		});
	}
});
