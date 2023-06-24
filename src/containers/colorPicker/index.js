import React from 'react'

const ColorPicker = (props) => {
  const {color, onClick} = props
  return (
    <div style={{padding: 5}}>
      <div 
          className='color-picker'
          style={{
              backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
              width: 40,
              height: 40,
              borderRadius: 20,
              cursor: 'pointer'
          }}
          onClick={onClick}
      >
      </div>
    </div>
  )
}

export default ColorPicker
