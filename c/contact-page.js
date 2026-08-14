(async () => {
  const page = document.querySelector("[data-contact-page]");
  const slug = window.location.pathname.split("/").filter(Boolean).at(-1).toLowerCase();

  try {
    const response = await fetch("../employees.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Employee data could not be loaded.");

    const { site, employees } = await response.json();
    const employee = employees.find((person) => person.slug === slug);
    if (!employee) throw new Error("This contact page is unavailable.");

    document.title = `${employee.name} | ${site.name}`;
    document.querySelector("[data-company-name]").textContent = site.name;
    document.querySelector("[data-name]").textContent = employee.name;
    document.querySelector("[data-role]").textContent = employee.role || "Acre Scouts";

    const photo = document.querySelector("[data-photo]");
    if (employee.photo) {
      photo.src = employee.photo;
      photo.alt = `${employee.name} portrait`;
    } else {
      photo.remove();
    }

    const linkedIn = document.querySelector("[data-linkedin]");
    linkedIn.href = employee.linkedin || site.linkedin;

    const website = document.querySelector("[data-website]");
    website.href = site.website;

    addOptionalLink("phone", employee.phone, (value) => `tel:${value.replace(/[^+\d]/g, "")}`);
    addOptionalLink("whatsapp", employee.whatsapp, (value) => `https://wa.me/${value.replace(/[^\d]/g, "")}`);
    addOptionalLink("email", employee.email, (value) => `mailto:${value}`);

    page.hidden = false;
  } catch (error) {
    document.querySelector("[data-error]").hidden = false;
    console.error(error);
  }

  function addOptionalLink(kind, value, makeHref) {
    if (!value) return;
    const item = document.querySelector(`[data-${kind}]`);
    const link = item.querySelector("a");
    link.href = makeHref(value);
    link.textContent = value;
    item.hidden = false;
  }
})();
