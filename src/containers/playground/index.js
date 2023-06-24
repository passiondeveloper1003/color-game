import React, { useEffect, useState } from 'react'
import {Draggable, Droppable} from "react-tiny-drag-drop";
import ColorItem from '../colorItem'
import ColorPicker from '../colorPicker'

const INITIAL_STATE = "INITIAL_STATE"
const FIRST_PICK_STATE = "FIRST_PICK_STATE"
const SECOND_PICK_STATE = "SECOND_PICK_STATE"
const THIRD_PICK_STATE = "THIRD_PICK_STATE"

const Playground = (props) => {
  let initialItems = []
  for(let i = 0; i < props.gameinfo.height; i++) {
    let newRow = []
    for (let j = 0; j < props.gameinfo.width; j++) {
      newRow.push({
          red: 0,
          green: 0,
          blue: 0,
          x: j,
          y: i,
        })
    }
    initialItems.push(newRow)
  }

  const [colorItems, setColorItems] = useState(initialItems)
  const [colorPickers, setColorPickers] = useState({
    top: [],
    bottom: [],
    left: [],
    right: []
  })
  const [status, setStatus] = useState(INITIAL_STATE)
  const [closest, setClosest] = useState({x: 0, y: 0})
  const [moves, setMoves] = useState(props.gameinfo.maxMoves)
  
  useEffect(() => {
    let xPickers = []
    let yPickers = []
    for(let i = 0; i < props.gameinfo.width; i++) {
      xPickers.push({
        red: 0,
        green: 0,
        blue: 0,
      })
    }
    for(let i = 0; i < props.gameinfo.height; i++) {
      yPickers.push({
        red: 0,
        green: 0,
        blue: 0,
      })
    }
    setColorPickers({
      top: xPickers,
      bottom: xPickers,
      left: yPickers,
      right: yPickers
    })
  }, [])

  const onClickPicker = (type, number) => () => {
    
    if(status === THIRD_PICK_STATE)
      return
    if(moves === 0)
      return

    setMoves(moves - 1)

    let color = {
      red: 0,
      green: 0,
      blue: 0,
    }
    switch(status) {
      case INITIAL_STATE:
        setStatus(FIRST_PICK_STATE);
        color = {
          red: 255,
          green: 0,
          blue: 0,
        }
        break
      case FIRST_PICK_STATE:
        setStatus(SECOND_PICK_STATE)
        color = {
          red: 0,
          green: 255,
          blue: 0,
        }
        break
      case SECOND_PICK_STATE:
        setStatus(THIRD_PICK_STATE)
        color = {
          red: 0,
          green: 0,
          blue: 255,
        }
        break
      default:
        break
    }
    let colors = [...colorPickers[type]]
    colors[number] = color

    let newPickers = {
      ...colorPickers,
      [type]: colors
    } 
    
    setColorPickers(newPickers)
    onPickerChange(newPickers)
  }

  const onPickerChange = (newPickers) => {
    let newItems = []
    let minDistance = getDistance(props.gameinfo.target, {
      red: 0,
      green: 0,
      blue: 0
    })
    let minPosition = {
      x: 0,
      y: 0,
    }
    for(let i = 0; i < props.gameinfo.height; i++) {
      let newRow = []
      for (let j = 0; j < props.gameinfo.width; j++) {
        let pickers = [
          {
            type: "top",
            color: newPickers.top[j]
          },
          {
            type: "bottom",
            color: newPickers.bottom[j]
          },
          {
            type: "left",
            color: newPickers.left[i]
          },
          {
            type: "right",
            color: newPickers.right[i]
          },
        ]

        const affectedPickers = pickers.filter(item => (item.color.red + item.color.green + item.color.blue) > 0)
        let newColor = null
        pickers = pickers.map(item => {
          let color = null
          switch(item.type) {
            case "top":
              color = {
                red: item.color.red * (props.gameinfo.height - i) / (props.gameinfo.height + 1),
                green: item.color.green * (props.gameinfo.height - i) / (props.gameinfo.height + 1),
                blue: item.color.blue * (props.gameinfo.height - i) / (props.gameinfo.height + 1),
              }
              break;
            case "bottom":
              color = {
                red: item.color.red * (i + 1) / (props.gameinfo.height + 1),
                green: item.color.green * (i + 1) / (props.gameinfo.height + 1),
                blue: item.color.blue * (i + 1) / (props.gameinfo.height + 1),
              }
              break;
            case "left":
              color = {
                red: item.color.red * (props.gameinfo.width - j) / (props.gameinfo.width + 1),
                green: item.color.green * (props.gameinfo.width - j) / (props.gameinfo.width + 1),
                blue: item.color.blue * (props.gameinfo.width - j) / (props.gameinfo.width + 1),
              }
              break;
            case "right":
              color = {
                red: item.color.red * (j + 1) / (props.gameinfo.width + 1),
                green: item.color.green * (j + 1) / (props.gameinfo.width + 1),
                blue: item.color.blue * (j + 1) / (props.gameinfo.width + 1),
              }
              break;
            default:
              break;
          }
          return {
            type: item.type,
            color
          }
        })

        if(affectedPickers.length === 0) {
          newColor = {
            red: 0,
            green: 0,
            blue: 0
          }
        } else if(affectedPickers.length === 1) {
          newColor = pickers.find(item => item.type === affectedPickers[0].type).color
        } else {
          const r = pickers[0].color.red + pickers[1].color.red + pickers[2].color.red + pickers[3].color.red
          const g = pickers[0].color.green + pickers[1].color.green + pickers[2].color.green + pickers[3].color.green
          const b = pickers[0].color.blue + pickers[1].color.blue + pickers[2].color.blue + pickers[3].color.blue
          const f = 255 / Math.max(r, g, b, 255)
          newColor = {
            red: r * f,
            green: g * f,
            blue: b * f
          } 
        }
        if(getDistance(newColor, props.gameinfo.target) < minDistance) {
          minPosition = {x: j, y: i}
          minDistance = getDistance(newColor, props.gameinfo.target)
        }
        newRow.push(newColor)
      }
      newItems.push(newRow)
    }
    setClosest(minPosition)
    setColorItems(newItems)
  }

  const onDrop = (type, index) => (key) => {
    setMoves(prevMoves => {
      if(prevMoves === 0) {
        return prevMoves
      }
      const y = Math.floor(key / props.gameinfo.width)
      const x = key % 10
      setColorItems(prevItems => {
        
        const newColor = prevItems[y][x]
        
        setColorPickers(prevPickers => {
          let colors = [...prevPickers[type]]
          colors[index] = newColor
    
          let newPickers = {
            ...prevPickers,
            [type]: colors
          }
          onPickerChange(newPickers);
          return newPickers;
        })
        return prevItems;
      })
      return prevMoves - 1
    })
  }

  const getDistance = (color1, color2) => {
    const distance = Math.sqrt(
      (color1.red - color2.red) * (color1.red - color2.red) + 
      (color1.green - color2.green) * (color1.green - color2.green) + 
      (color1.blue - color2.blue) * (color1.blue - color2.blue)
    ) / 255 / Math.sqrt(3)
    return distance
  }
  const closestDistance = getDistance(props.gameinfo.target, colorItems[closest.y][closest.x]) * 100
  if(closestDistance <= 10) {
    alert("You win")
  }
  if(moves === 0 && closestDistance > 10) {
    alert("You lose")
  }
  return (
    <div className='play-ground'>
      <div className='d-flex align-items-center mt-5'>
        <h5 className='ms-5 me-3'><strong>Target:</strong></h5>
        <ColorItem color={props.gameinfo.target}/>
      </div>
      <div className='d-flex align-items-center mt-3'>
        <h5 className='ms-5 me-3'><strong>Closest:</strong></h5>
        <ColorItem color={colorItems[closest.y][closest.x]}/>
        <h5 className='ms-3 fw-bold'>△={Math.floor(closestDistance * 100) / 100}%</h5>
      </div>
      <div className='d-flex align-items-center mt-3'>
        <h5 className='ms-5 fw-bold'>Moves: {moves}</h5>
      </div>
      <div className='d-flex align-items-center my-5 mx-auto'>
        <div>
          {colorPickers.left.map((color, i) => (
            <Droppable context="item" onDrop={onDrop('left', i)} key={"left" + i}>
              <ColorPicker color={color} type="left" onClick={onClickPicker('left', i)} />
            </Droppable>
          ))}
        </div>
        <div>
          <div className='d-flex'>
            {colorPickers.top.map((color, i) => (
              <Droppable context="item" onDrop={onDrop('top', i)} key={"top" + i}>
                <ColorPicker color={color} type="top" onClick={onClickPicker('top', i)} />
              </Droppable>
            ))}
          </div>
          {colorItems.map((row, i) => (
            <div className='d-flex' key={i}>
              {row.map(((color, j)=> {
                const isTarget = i === closest.y && j === closest.x
                return status === THIRD_PICK_STATE ? (
                  <Draggable context="item" dataKey={i * 10 + j} key={i * 10 + j}>
                    <ColorItem color={color} isTarget={isTarget} />
                  </Draggable>
                ) : (
                  <ColorItem 
                    key={i * 10 + j}
                    color={color}
                    isTarget={isTarget}
                  />
                )
              }))}
            </div>
          ))}
          <div className='d-flex'>
            {colorPickers.bottom.map((color, i) => (
              <Droppable context="item" onDrop={onDrop('bottom', i)} key={"bottom" + i}>
                <ColorPicker color={color} type="bottom" onClick={onClickPicker('bottom', i)} />
              </Droppable>
            ))}
          </div>
        </div>
        <div>
          {colorPickers.right.map((color, i) => (
            <Droppable context="item" onDrop={onDrop('right', i)} key={"right" + i}>
              <ColorPicker color={color} type="right" onClick={onClickPicker('right', i)} />
            </Droppable>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Playground
