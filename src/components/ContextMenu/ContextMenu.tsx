import { ContextMenuDiv } from "../../styles/styles"
import { TContextMenu } from "../../types"

export default function ContextMenu({top, left, handleEditClick, handleDeleteClick} : TContextMenu) {
  return (
    <ContextMenuDiv top={top} left={left}>
      <ul>
        {
          handleEditClick &&
          <li onClick={() => handleEditClick()}>Edit</li>
        }
        <li onClick={() => handleDeleteClick()}>Delete</li>
      </ul>
    </ContextMenuDiv>
  )
}
