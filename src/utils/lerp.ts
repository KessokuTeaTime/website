export class Lerp {
  factor: number
  value: number
  target: number

  constructor(factor: number = 0.15, value: number = 0, target: number = 0) {
    this.factor = factor
    this.value = value
    this.target = target
  }

  update() {
    this.value += (this.target - this.value) * this.factor
  }
}
