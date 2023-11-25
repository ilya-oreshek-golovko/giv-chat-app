import React from 'react'

export default function WaitingSpinner() {
  const getStyleObj = (elementIndex : number) => {
      return {
          "--index" : elementIndex
      } as React.CSSProperties;
  }
  return (
    <div className='waiting-spinner'>
        <span style={getStyleObj(1)}></span>
        <span style={getStyleObj(2)}></span>
        <span style={getStyleObj(3)}></span>
        <span style={getStyleObj(4)}></span>
        <span style={getStyleObj(5)}></span>
        <span style={getStyleObj(6)}></span>
        <span style={getStyleObj(7)}></span>
        <span style={getStyleObj(8)}></span>
        <span style={getStyleObj(9)}></span>
        <span style={getStyleObj(10)}></span>
        <span style={getStyleObj(11)}></span>
        <span style={getStyleObj(12)}></span>
        <span style={getStyleObj(13)}></span>
        <span style={getStyleObj(14)}></span>
        <span style={getStyleObj(15)}></span>
        <span style={getStyleObj(16)}></span>
        <span style={getStyleObj(17)}></span>
        <span style={getStyleObj(18)}></span>
        <span style={getStyleObj(19)}></span>
        <span style={getStyleObj(20)}></span>
    </div>
  )
}
