export class AnimateOneShot {
  animate: boolean = false
  private isInitialized: boolean = false

  constructor() {}

  trigger() {
    if (this.isInitialized) {
      this.animate = false
      setTimeout(() => {
        this.animate = true
      }, 1)
    } else {
      this.isInitialized = true
      this.animate = true
    }
  }
}
