import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/atkinson-hyperlegible-next'
import '@fontsource/atkinson-hyperlegible-mono'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { initSmoothScroll } from './lib/smoothScroll'
import './styles/index.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger, SplitText)
initSmoothScroll()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
