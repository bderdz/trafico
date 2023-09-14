// NavBar & Burger
const useNavBar = () => {
	const burgerButton = document.querySelector(".burger__icon");
	const navBar = document.querySelector(".header__nav");

	// Toggle nav bar visability
	const toggleNavBar = () => {
		navBar.classList.toggle("header__nav_open");

		// Switching body overflow for non-scroll effect
		const bodyStyles = document.body.style;
		bodyStyles.overflow
			? (bodyStyles.overflow = "")
			: (bodyStyles.overflow = "hidden");
	};

	// Toggle burger icon
	const toggleBurger = () => {
		burgerButton.classList.toggle("burger__icon_active");
	};

	burgerButton.addEventListener("click", () => {
		toggleBurger();
		toggleNavBar();
	});

	// Auto closing after click on nav links
	navBar.addEventListener("click", (event) => {
		const target = event.target;

		if (!target.classList.contains("nav")) {
			toggleBurger();
			toggleNavBar();
		}
	});
};

window.addEventListener("DOMContentLoaded", () => {
	useNavBar();
});
