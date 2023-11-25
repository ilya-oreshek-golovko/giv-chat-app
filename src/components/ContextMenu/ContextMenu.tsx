import { ContextMenuDiv } from "../../styles/styles"
import { TContextMenu } from "../../types"

export default function ContextMenu({top, left, handleEditClick, handleDeleteClick} : TContextMenu) {
  return (
    <ContextMenuDiv top={top} left={left}>
      <ul>
        {
          handleEditClick &&
          <li onClick={() => handleEditClick()}><span>Edit</span></li>
        }
        <li onClick={() => handleDeleteClick()}><span>Delete</span></li>
      </ul>
    </ContextMenuDiv>
  )
}
