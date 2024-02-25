import React, { useEffect, useRef, useState } from 'react'
import Desktop from './Desktop'
import Mobile from './Mobile'

export default function Header() {
  const [isMobile, setIsMobile] = useState(false)
  const viewportWidth = useRef(0)
  
  const handleResize = () => {
    viewportWidth.current = window.innerWidth
    if(viewportWidth.current >= 1024){setIsMobile(false)} else setIsMobile(true)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [] )


  return (
    <>
    <div className='header' style={{width: '100%', height: '70px',}}>
      {!isMobile && <Desktop />}
      {isMobile && <Mobile />}
    </div>
    </>
  )
}
