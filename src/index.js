import m from "mithril"
import { throttle } from 'throttle-debounce'
let mouseX = 0
let windowWidth = window.innerWidth
let displayTitle = true

const DrawLinesHorizontal = () =>
    m("g", { style: { transform: "translateY(38%)", backfaceVisibility: "hidden" } }, [...Array(8)].map((_, i) => m("g", { style: { opacity: 0 }}, [
        m("rect.pink", { x: 0, y: 0, width: "100%", height: 5, shapeRendering: "optimizeSpeed", fill: "url(#gradient-pink-horizontal)" }),
        m("animateTransform", {
            attributeName: "transform", type: "translate",
            from: "0 0", to: `0 ${window.innerHeight * 0.62}`, dur: "4s",
            calcMode: "spline", keyTimes: "0;1", keySplines: "0.6 0.15 0.91 0.68",
            begin: i / 2, repeatCount: "indefinite"
        } ),
        m("animateTransform", {
            attributeName: "transform", type: "scale",
            from: "1 0", to: "1 3", dur: "4s",
            calcMode: "spline", keyTimes: "0; 1", keySplines: "0.1 0 0.5 1",
            begin: i / 2, repeatCount: "indefinite",
            additive: "sum"
        }),
        m("animate", {
            attributeName: "opacity",
            from: 0, to: 1, dur: "4s",
            calcMode: "spline", keyTimes: "0; 1", keySplines: "0 0.5 1 1",
            begin: i / 2, repeatCount: "indefinite"
        })
    ])))

const DrawLinesVertical = () =>
    m("g",
        { style: { transform: `translate(0%, 38%)`, backfaceVisibility: "hidden", shapeRendering: "optimizeSpeed" } },
        [...Array(12)].map((_, i) => m("g", [
            m("line.sw-2.fade-in", { x1: `${ i * 10 + mouseX * -20 }%`, x2: `${ i * 10 + (i - 5) * 30 - 10 }%`, y1: 0, y2: "100%", stroke: "url(#gradient-pink-vertical)" })
    ])))

const DrawPlane = () =>
    m("rect.stretch-in", { style: { transform: 'scaleY(0)', animationDelay: '0s', transformOrigin: '0% 37%' }, x: 0, y: "37%", width: "100%", height: '80%', shapeRendering: "optimizeSpeed", fill: "url(#gradient-pink-plane)" })

const mouseMove = (ev) => {
    mouseX -= (mouseX - (ev.clientX / windowWidth - 0.5)) / 3
    m.redraw()
}

const Gradients = () =>
    m("defs", [
        m("linearGradient", { id: "gradient-pink-horizontal", x1: 0, x2: 0, y1: 0, y2: 1 }, [
            m("stop", { offset: "0%", ['stop-opacity']: 0 }),
            m("stop", { offset: "79%", ['stop-color']: "rgb(240, 197, 244)", ['stop-opacity']: 0.2 }),
            m("stop", { offset: "80%", ['stop-color']: "rgb(240, 197, 244)", ['stop-opacity']: 1 })
        ]),
        m("linearGradient", { id: "gradient-pink-vertical", x1: 0, x2: 0, y1: 0, y2: 1 }, [
            m("stop", { offset: "0", ['stop-opacity']: 0.0 }),
            m("stop", { offset: "7%", ['stop-color']: "rgb(240, 197, 244)", ['stop-opacity']: 1 })
        ]),
        m("linearGradient", { id: "gradient-pink-plane", x1: 0, x2: 0, y1: 0, y2: 1 }, [
            m("stop", { offset: "0", ['stop-opacity']: 0.0 }),
            m("stop", { offset: "5%", ['stop-opacity']: 0.3, ['stop-color']: "rgb(200, 100, 255)"}),
            m("stop", { offset: "80%", ['stop-opacity']: 0.3, ['stop-color']: "rgb(200, 100, 255)"}),
            m("stop", { offset: "100%", ['stop-opacity']: 0})
        ])
    ])

const SplashGrid = {
    view: () => m("svg", { style: { width: "100%", height: "100%" } }, [
        Gradients(),
        DrawLinesHorizontal(),
        DrawLinesVertical(),
        DrawPlane()
        ]),
    oninit: () => {
        document.addEventListener('mousemove', mouseMove)
    }
}

const SplashTitle = {
    view: () => m("div", [
        m("h1.glow.fade-in", { style: { animationDelay: '2s', opacity: 0 }}, 'HACKERMAN.fi'),
        m("h2.fade-in-still", { style: { animationDelay: '3s', opacity: 0, marginTop: '23px' }}, 'SPECIALIZED IN'),
        m("h2.fade-in-still", { style: { animationDelay: '3s', opacity: 0 }}, 'COOL WEB DEVELOPMENT')
    ])
}

const Background = {
    view: () => m('div', { style: { width: '100%', height: '100%' }}, [
        m("img", { src: 'src/galaxy.jpg', style: { width: "100%", height: "100%", objectFit: 'cover', filter: 'blur(2px) brightness(1.2)', transform: "translate3d(0,0,0)" } }),
        m("div.fade-out", { style: { position: 'absolute', top: 0, width: '100%', height: '100%', zIndex: 2, backgroundColor: 'black' }})
    ])
}

m.mount(document.getElementById('splash-grid'), SplashGrid);
m.mount(document.getElementById('splash-title'), SplashTitle);
m.mount(document.getElementById('splash-background'), Background);