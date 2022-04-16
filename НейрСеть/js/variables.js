export const canvas = document.getElementById("canvas")
export const ctx = canvas.getContext('2d')
export const pixel = 100
export let shapeForm = 'squares'
export let shapeWidth = 100
export let shapeHeight = 100
export let shapeNumber = 5
export let shapeAmount = Math.pow(shapeNumber, 2)
export let H
export let W = H = shapeWidth * shapeNumber
export let backColor = 'white'
export let border = 1
// цвет границ
export let borderColor = 'rgba(0,0,0,.4)'