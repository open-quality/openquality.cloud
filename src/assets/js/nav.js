document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('[data-nav-toggle]')
  const navLinks = document.querySelector('[data-nav-links]')
  const defaultDocTitle = document.title
  const titleChars = defaultDocTitle.split('')
  const alphaIndices = titleChars
    .map((char, index) => ({ char, index }))
    .filter(({ char }) => /[a-z]/i.test(char))
    .map(({ index }) => index)
  let titleInterval

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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!alphaIndices.length) return
      let toggleState = false
      let pointer = 0
      titleInterval = setInterval(() => {
        const updated = titleChars
          .map((char, idx) => {
            if (!/[a-z]/i.test(char)) return char
            return idx === alphaIndices[pointer] ? char.toUpperCase() : char.toLowerCase()
          })
          .join('')
        document.title = updated
        pointer = (pointer + 1) % alphaIndices.length
        toggleState = !toggleState
      }, 100)
    } else {
      clearInterval(titleInterval)
      document.title = defaultDocTitle
    }
  })
})
