import styled from '@emotion/styled'
import React, { useState } from 'react'

export default function Desktop() {
  const [isHover, setIsHover] = useState(false)
  const onMouseHover = () => {
    setIsHover(true)
  }
  const onMouseLeave = () => {
    setIsHover(false)
  }
  return (
    <div
      className="header-desktop flex row-auto px-12"
      style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
    >
      <div>Logo</div>
      <div className="flex row-auto" style={{ gap: '8px' }}>
        <div>
          <MenuElement onMouseEnter={onMouseHover} onMouseLeave={onMouseLeave}>
            Menu 1
          </MenuElement>
          {isHover && (
            <div
              style={{
                width: 100,
                height: 121,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1,
                backgroundColor: 'green'
              }}
            >
              Prova menu
            </div>
          )}
        </div>
        <MenuElement>Menu 2</MenuElement>
        <MenuElement>Menu 3</MenuElement>
        <MenuElement>Menu 4</MenuElement>
        <MenuElement>Menu 5</MenuElement>
      </div>
    </div>
  )
}

const MenuElement = styled.div`
  width: 100px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  :hover {
    background-color: blue;
  }
`
