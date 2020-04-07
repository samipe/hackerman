import m from "mithril"
import { debounce } from 'throttle-debounce'
import BezierEasing from 'bezier-easing'
let mouseX = 0
let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const canvas = document.getElementById("splash-grid")
const ctx = canvas.getContext("2d")
let loopLength = 4000 // milliseconds
const easing = BezierEasing(0.6, 0.15, 0.91, 0.68)
const gradient = ctx.createLinearGradient(0, 0, 0, 10)
const gradientVertical = ctx.createLinearGradient(0, 0, 0, 80)
const gradientGlow = ctx.createLinearGradient(0, 0, 0, 30)
let shownHeight = 0
let isFadingIn = true
let firstLineIndex = false
let heightHiddenByContent = windowHeight
const contentContainerElement = document.getElementById('content-container')
let titleOpacity = 1

export const initSplashScreen = () => {
    gradient.addColorStop(0, 'rgba(240, 197, 244, 0)')
    gradient.addColorStop(.79, 'rgba(240, 197, 244, 0.5)')
    gradient.addColorStop(0.8, 'rgba(240, 197, 244, 1)')
    gradientVertical.addColorStop(0.1, 'rgba(240, 197, 244, 0)')
    gradientVertical.addColorStop(1, 'rgba(240, 197, 244, 1)')
    gradientGlow.addColorStop(0, 'rgba(240, 197, 244, 0)')
    gradientGlow.addColorStop(1, 'rgba(240, 197, 244, 0.1)')
    canvas.width = windowWidth
    canvas.height = windowHeight
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('keypress', onKeyPress)
    window.addEventListener('resize', debounce(300, () => onResize()))
    window.addEventListener('scroll', onScroll)
    animate()
}

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const drawLines = () => {
    ctx.lineWidth = 22
    const time = new Date().getTime()
    const step =  time % loopLength / loopLength
    // first tick, let's find out the first line
    if (firstLineIndex === false) {
        firstLineIndex = 10 - parseInt((step) * 10)
        if (firstLineIndex === 10) firstLineIndex = 0
    }
    // horizontal
    for (let i = 0; i < 10; i++) {
        ctx.save()
        const lineYPosition = easing((step + i / 10) % 1) * canvas.height
        if (i === firstLineIndex && isFadingIn) {
            if (shownHeight > lineYPosition) {
                isFadingIn = false
            } else {
                shownHeight = lineYPosition
            }
        }
        ctx.translate(0, lineYPosition)
        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.globalAlpha = lineYPosition / 50
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width, 0)
        ctx.stroke()
        ctx.restore()
    }
    ctx.lineWidth = 2
    // vertical
    for (let i = 0; i < 16; i++) {
        ctx.save()
        const lineXPositionTop = canvas.width * i / 10 - canvas.width / 10 * 3
        const lineXPositionBottom = lineXPositionTop + (lineXPositionTop - canvas.width)
        ctx.translate(lineXPositionTop + mouseX * canvas.width / 5, 0)
        ctx.beginPath()
        ctx.strokeStyle = gradientVertical
        ctx.moveTo(0, 0)
        ctx.lineTo(lineXPositionBottom - mouseX * canvas.width / 7, canvas.height)
        ctx.stroke()
        ctx.restore()
    }
    // glowing plane
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = gradientGlow
    ctx.fill()
}

const fadeIn = () => {
    ctx.clearRect(0, shownHeight + 10, canvas.width, canvas.height)
}

const animate = () => {
    if (heightHiddenByContent > 0) {
        clearCanvas()
        drawLines()
        if (isFadingIn) fadeIn()
    }
    window.requestAnimationFrame(animate)
}

const onMouseMove = (ev) => {
    mouseX -= (mouseX - (ev.clientX / windowWidth - 0.5)) / 3
}
const onKeyPress = (ev) => {
    if (ev.keyCode === 45) loopLength = loopLength * 1.2
    if (ev.keyCode === 43) loopLength = loopLength * 0.8
}
const onResize = () => {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
    canvas.width = windowWidth
    canvas.height = windowHeight
    onScroll()
}
const onScroll = () => {
    if (window.navBarTop === 0) {
        heightHiddenByContent = 0
        return
    }
    const top = contentContainerElement.getBoundingClientRect().top
    heightHiddenByContent = top + ((top - canvas.height) * 0.47)
    if (titleOpacity >= 1 && heightHiddenByContent / 250 >= 1) {
        titleOpacity = heightHiddenByContent / 250
    } else if (titleOpacity <= 0 && heightHiddenByContent / 250 <= 0) {
        titleOpacity = heightHiddenByContent / 250
    } else {
        titleOpacity = heightHiddenByContent / 250
        m.redraw()
    }
}

const SplashTitle = {
    view: () => m("div", { style: { opacity: titleOpacity }}, [
        m("h1.glow.fade-in", { style: { animationDelay: '1.1s', opacity: 0 }}, 'HACKERMAN.fi'),
        m("h2.spread.fade-in-still", { style: { animationDelay: '2.1s', opacity: 0, marginTop: '23px' }}, 'HARDCORE WEB DEV')
    ])
}

const Background = {
    view: () => m('div', { style: { width: '100%', height: '100%' }}, [
        m("img", { src: 'src/galaxy.jpg', style: { width: "100%", height: "100%", objectFit: 'cover' } }),
        m("div.fade-out", { style: { position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: 2, backgroundColor: 'black' }})
    ])
}

m.mount(document.getElementById('splash-title'), SplashTitle);
m.mount(document.getElementById('splash-background'), Background);