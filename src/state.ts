
import { content } from "./content"

export class StateManager {

  value: number

  nav: HTMLElement
  map: HTMLElement
  // hereMap: HereMap
  backDrop: HTMLElement


  constructor(nav: HTMLElement, map: HTMLElement, backDrop: HTMLElement) {
    this.value = -1

    this.nav = nav
    this.map = map
    // this.hereMap = hereMap
    this.backDrop = backDrop
  }

  changeState(val: number) {
    this.value = val
    this.loadState()
  }

  moveState() {
    if ((this.value > -1 && this.value < 3) || (this.value > 3 && this.value < 7))
      this.value++
    else if (this.value == 3 || this.value == 7)
      this.value = -1
      
    this.loadState()
  }

  loadState() {
    switch (this.value) {
      case 0:
        this.loadDStart()
        break
      case 1:
        this.loadDSec()
        break
      case 2:
        this.loadDThird()
        break
      case 3:
        this.loadDFour()
        break
      case 4:
        this.loadEStart()
        break
      case 5:
        this.loadESec()
        break
      case 6:
        this.loadEThird()
        break
      case 7:
        this.loadEFour()
        break
      default:
        this.value = -1
        this.loadBlank()
        break
    }
  }

  loadBlank() {
    this.nav.style.backgroundImage = "url(\'" + content.NAV.CLEAN + "\')"
    this.backDrop.style.backgroundImage = ""
    this.backDrop.style.backgroundColor = "#306BAF"
    this.xlg_map()

    let event = new CustomEvent("reset-map")
    document.dispatchEvent(event)
  }

  loadDStart() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.frank + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.frankDwayne.accept + "\')"
    this.lg_map()

    let event = new CustomEvent("add-iwerx-marker")
    document.dispatchEvent(event)
  }

  loadDSec() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.frank + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.frankDwayne.perform + "\')"
    this.lg_map()
    
    // directions
    let event = new CustomEvent("show-directions")
    document.dispatchEvent(event)
  }

  loadDThird() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.dwayne + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.frankDwayne.tipping + "\')"
    this.sm_map()

    let event = new CustomEvent("resize-map-for-small")
    document.dispatchEvent(event)
  }

  loadDFour() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.CLEAN + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.frankDwayne.console + "\')"
    this.no_map()
  }

  // evelyn states

  loadEStart() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.matt + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.mattEvelyn.accept + "\')"
    this.lg_map()

    let event = new CustomEvent("add-iwerx-marker")
    document.dispatchEvent(event)
  }

  loadESec() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.matt + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.mattEvelyn.perform + "\')"
    this.lg_map()

    let event = new CustomEvent("show-directions")
    document.dispatchEvent(event)
  }

  loadEThird() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.evelyn + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.mattEvelyn.tipping + "\')"
    this.sm_map()

    let event = new CustomEvent("resize-map-for-small")
    document.dispatchEvent(event)
  }

  loadEFour() {
    this.backDrop.style.backgroundColor = "transparent"
    this.nav.style.backgroundImage = "url(\'" + content.NAV.CLEAN + "\')"
    this.backDrop.style.backgroundImage = "url(\'" + content.mattEvelyn.console + "\')"
    this.no_map()
  }



  xlg_map() {
    this.map.classList.remove("map-sm")
    this.map.classList.remove("map-lg")
    this.map.classList.remove("map-no")

    this.map.classList.add("map-xlg")
  }
  lg_map() {
    this.map.classList.remove("map-sm")
    this.map.classList.remove("map-xlg")
    this.map.classList.remove("map-no")

    this.map.classList.add("map-lg")
  }
  sm_map() {
    this.map.classList.remove("map-xlg")
    this.map.classList.remove("map-lg")
    this.map.classList.remove("map-no")

    this.map.classList.add("map-sm")
  }
  no_map() {
    this.map.classList.remove("map-sm")
    this.map.classList.remove("map-lg")
    this.map.classList.remove("map-xlg")

    this.map.classList.add("map-no")
  }
}
