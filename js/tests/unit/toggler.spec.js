import Toggler from '../../src/toggler.js'
import { clearFixture, getFixture } from '../helpers/fixture.js'

describe('Toggler', () => {
  let fixtureEl

  beforeAll(() => {
    fixtureEl = getFixture()
  })

  afterEach(() => {
    clearFixture()
  })

  describe('VERSION', () => {
    it('should return plugin version', () => {
      expect(Toggler.VERSION).toEqual(jasmine.any(String))
    })
  })

  describe('constructor', () => {
    it('should take care of element either passed as a CSS selector or DOM element', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const togglerBySelector = new Toggler('[data-bs-toggle="toggler"]')
      const togglerByElement = new Toggler(togglerEl)

      expect(togglerBySelector._element).toEqual(togglerEl)
      expect(togglerByElement._element).toEqual(togglerEl)
    })
  })

  describe('toggle', () => {
    it('should toggle class on the element', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      toggler.toggle()
      expect(togglerEl.classList.contains('bg-warning')).toBeTrue()

      toggler.toggle()
      expect(togglerEl.classList.contains('bg-warning')).toBeFalse()
    })

    it('should toggle attribute on the element', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="true" data-bs-attribute="hidden"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      toggler.toggle()
      expect(togglerEl.getAttribute('hidden')).toEqual('true')

      toggler.toggle()
      expect(togglerEl.hasAttribute('hidden')).toBeFalse()
    })

    it('should not toggle id attribute', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="new-id" data-bs-attribute="id"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      toggler.toggle()
      expect(togglerEl.getAttribute('id')).toBeNull()
    })

    it('should trigger events', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      const toggleSpy = jasmine.createSpy()
      const toggledSpy = jasmine.createSpy()

      togglerEl.addEventListener('toggle.bs.toggler', toggleSpy)
      togglerEl.addEventListener('toggled.bs.toggler', toggledSpy)

      toggler.toggle()

      expect(toggleSpy).toHaveBeenCalled()
      expect(toggledSpy).toHaveBeenCalled()
    })

    it('should not trigger toggled event if toggle is prevented', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      const toggledSpy = jasmine.createSpy()

      togglerEl.addEventListener('toggle.bs.toggler', event => {
        event.preventDefault()
      })
      togglerEl.addEventListener('toggled.bs.toggler', toggledSpy)

      toggler.toggle()

      expect(toggledSpy).not.toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose a toggler', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      expect(Toggler.getInstance(togglerEl)).not.toBeNull()

      toggler.dispose()

      expect(Toggler.getInstance(togglerEl)).toBeNull()
    })
  })

  describe('getInstance', () => {
    it('should return null if there is no instance', () => {
      expect(Toggler.getInstance(fixtureEl)).toBeNull()
    })

    it('should return this instance', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      expect(Toggler.getInstance(togglerEl)).toEqual(toggler)
      expect(Toggler.getInstance(togglerEl)).toBeInstanceOf(Toggler)
    })
  })

  describe('getOrCreateInstance', () => {
    it('should return toggler instance', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')
      const toggler = new Toggler(togglerEl)

      expect(Toggler.getOrCreateInstance(togglerEl)).toEqual(toggler)
      expect(Toggler.getInstance(togglerEl)).toEqual(Toggler.getOrCreateInstance(togglerEl, {}))
      expect(Toggler.getOrCreateInstance(togglerEl)).toBeInstanceOf(Toggler)
    })

    it('should return new instance when there is no toggler instance', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')

      expect(Toggler.getInstance(togglerEl)).toBeNull()
      expect(Toggler.getOrCreateInstance(togglerEl)).toBeInstanceOf(Toggler)
    })
  })

  describe('data-api', () => {
    it('should toggle class on click', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="bg-warning" data-bs-attribute="class"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')

      togglerEl.click()
      expect(togglerEl.classList.contains('bg-warning')).toBeTrue()

      togglerEl.click()
      expect(togglerEl.classList.contains('bg-warning')).toBeFalse()
    })

    it('should toggle attribute on click', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="true" data-bs-attribute="hidden"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')

      togglerEl.click()
      expect(togglerEl.getAttribute('hidden')).toEqual('true')

      togglerEl.click()
      expect(togglerEl.hasAttribute('hidden')).toBeFalse()
    })

    it('should not toggle id attribute on click', () => {
      fixtureEl.innerHTML = '<div data-bs-toggle="toggler" data-bs-value="new-id" data-bs-attribute="id"></div>'

      const togglerEl = fixtureEl.querySelector('[data-bs-toggle="toggler"]')

      togglerEl.click()
      expect(togglerEl.getAttribute('id')).toBeNull()
    })
  })
})
