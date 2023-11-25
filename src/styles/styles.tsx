import styled, { css, keyframes } from 'styled-components';
interface IContextMenuDiv{
    top: number,
    left: number
}

const slidebg = keyframes`
  to {
    background-position:20vw;
  }
`

const ContextMenuDiv = styled.div<IContextMenuDiv>`
  position: absolute;
  z-index: 100;
  width: 200px;
  background-color: #1c2b35;
  border-radius: .8rem;
  box-sizing: border-box;
  ${({ top, left }) => css`
    top: ${top}px;
    left: ${left}px;
  `}
  ul {
    box-sizing: border-box;
    margin: 0;
    list-style: none;
  }
  ul li {
    padding: 18px 12px;
    color: #f0eceb;
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }
  ul li span {
    z-index: 20;
  }
  ul li:after {
    background: #fff;
    content: "";
    height: 155px;
    left: -75px;
    opacity: .2;
    position: absolute;
    top: -50px;
    transform: rotate(35deg);
    transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
    width: 50px;
    z-index: -10;
  }
  ul li:first-child{
    border-top-left-radius: .8rem;
    border-top-right-radius: .8rem;
  }
  ul li:last-child{
    border-bottom-left-radius: .8rem;
    border-bottom-right-radius: .8rem;
  }
  ul li:hover:after {
    left: 120%;
    transition: all 1.5s cubic-bezier(0.19, 1, 0.22, 1);
  }
`;

  /* hover */
  // ul li:hover {
  //   cursor: pointer;
  //   background-image: linear-gradient(90deg, #3a4a55 0%, #FFCF00 49%, #FC4F4F 80%, #00C0FF 100%);
  //   animation: ${slidebg} 5s linear infinite;
  // }

export {ContextMenuDiv}