const links = document.querySelectorAll(".nav-link");
console.log(links);
console.log(window.location.pathname);
links.forEach(function(link) {
    const linkHref = link.getAttribute("href");

    if (window.location.pathname.includes(linkHref.replace("../", ""))) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});