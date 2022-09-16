import { useSelector } from "react-redux";
import { useGetConversationsQuery } from "../../features/conversation/conversationApi";
import Error from "../ui/Error";
import ChatItem from "./ChatItem";
import moment from "moment/moment";
import getPartnerInfo from "../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user || {};
  const { data: conversations, isLoading, isError, error } = useGetConversationsQuery(email);

  let content = null;

  if (isLoading) {
    content = <h1>Loading....</h1>;
  } else if (!isLoading && isError) {
    content = <Error message={error.data.message} />;
  } else if (!isLoading && !isError && conversations?.length === 0) {
    content = <Error message="No conversetion found" />;
  } else if (!isLoading && !isError && conversations?.length > 0) {
    content = conversations.map((conversation) => {
      const { message, timestamp, id, users } = conversation;
      const partner = getPartnerInfo(users, email);
      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partner.email, { size: 80 })}
              name={partner.name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return <ul>{content}</ul>;
}
