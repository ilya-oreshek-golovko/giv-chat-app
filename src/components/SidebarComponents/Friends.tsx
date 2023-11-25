import { IChatHeader } from "../../interfaces";
import { useContextMenuManagement } from "../../hooks/MessagesHooks";
import { useFriendsManagement } from "../../hooks/FriendsHook";

export default function Friends({receivedChats} : {receivedChats : IChatHeader[]}) {

    const { ContextMenuComponent, setContextMenuState } = useContextMenuManagement();
    const {FriendList} = useFriendsManagement({setContextMenuState, receivedChats});

    return (
        <div className='sidebar-friends'>
            {
                FriendList()
            }
            {
                ContextMenuComponent()
            }
        </div>
    )
}
