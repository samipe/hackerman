import m from "mithril"
import { throttle } from 'throttle-debounce'
import { initSplashScreen } from './splashScreen.js'
let navAtTop = false
const navbar = document.getElementById('navbar')

const Navbar = {
    view: () => m('div', { style: { position: 'relative' }}, [
        navAtTop ? m('h2.fade-in-quick', { style: { padding: '0.5rem 25px' }}, 'Hackerman') : null,
        navAtTop ? null : m('h2.fade-in-quick', { style: { padding: '0.5rem 25px' }}, 'Consultancy for all things graphical'),
        m('hr', { style: { marginTop: 0, marginBottom: 0 }} ),
        m('div', { style: { height: '1.5rem', background: 'linear-gradient(rgba(10, 10, 15, 1), rgb(10, 10, 15, 0))', position: 'absolute', width: '100%' }})
    ])
}

const Content = {
    view: () => m('div', [
        m('h3', {style: { textAlign: 'center' }}, "Expert in high performance graphics and animations on web sites")
    ])
}

const onScroll = () => {
    window.navBarTop = navbar.getBoundingClientRect().top
    navAtTop = window.navBarTop === 0
    m.redraw()
}

initSplashScreen()
document.addEventListener('scroll', throttle(500, () => onScroll()))
m.mount(navbar, Navbar)
m.mount(document.getElementById('content-header'), Content)