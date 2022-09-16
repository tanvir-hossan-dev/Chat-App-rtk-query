import { useParams } from "react-router-dom";
import { useGetmessagesQuery } from "../../../features/message/messageApi";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import Error from "../../ui/Error";

export default function ChatBody() {
  const { id } = useParams();
  const { data: messages, isError, isLoading, error } = useGetmessagesQuery(id);

  let content = null;
  if (isLoading) {
    content = <h2>Loading..</h2>;
  } else if (!isLoading && isError) {
    content = <Error message={error?.data} />;
  } else if (!isLoading && !isError && messages?.length === 0) {
    content = <Error message="No message founds" />;
  } else if (!isLoading && !isError && messages?.length > 0) {
    content = (
      <div className="w-full grid conversation-row-grid">
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
        <Options />
      </div>
    );
  }

  return <div className="w-full lg:col-span-2 lg:block">{content}</div>;
}
