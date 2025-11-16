const toggle = document.querySelector('[data-nav-toggle]')
const navLinks = document.querySelector('[data-nav-links]')

if (toggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('is-open')
    toggle.setAttribute('aria-expanded', 'false')
    document.body.classList.remove('nav-open')
  }

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(isOpen))
    document.body.classList.toggle('nav-open', isOpen)
  })

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu)
  })
}
