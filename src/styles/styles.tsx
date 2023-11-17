import styled, { css } from 'styled-components';
interface IContextMenuDiv{
    top: number,
    left: number
}

const ContextMenuDiv = styled.div<IContextMenuDiv>`
position: absolute;
z-index: 100;
  width: 200px;
  background-color: #383838;
  border-radius: 5px;
  box-sizing: border-box;
  ${({ top, left }) => css`
    top: ${top/2}px;
    left: ${left*2}px;
  `}
  ul {
    box-sizing: border-box;
    padding: 10px;
    margin: 0;
    list-style: none;
  }
  ul li {
    padding: 18px 12px;
  }
  /* hover */
  ul li:hover {
    cursor: pointer;
    background-color: #000000;
  }
`;

export {ContextMenuDiv}