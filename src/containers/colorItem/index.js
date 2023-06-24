import React from 'react'

const ColorItem = (props) => {
  const {color, isTarget} = props
  return (
    <div style={{padding: 5}}>
      <div 
          className='color-picker'
          style={{
              backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
              width: 40,
              height: 40,
              borderRadius: 3,
              cursor: 'pointer',
              border: '2px solid ' + (isTarget ? 'red' : 'white')
          }}
      >
      </div>
    </div>
  )
}

export default ColorItem
