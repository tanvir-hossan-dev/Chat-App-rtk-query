import { useState } from "react";
import { useGetUserQuery } from "../../features/user/usersApi";
import ValidateEmail from "../valided/EmailValid";
import Error from "../ui/Error";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import conversationApi, {
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversation/conversationApi";

export default function Modal({ open, control }) {
  const dispatch = useDispatch();
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(undefined);
  const [userCheck, setUserCheck] = useState(false);
  const [responseError, setResponseError] = useState("");
  const { user } = useSelector((state) => state.auth) || {};
  const [addConversation, { isSuccess: isAddConversationSuccess }] = useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSuccess }] = useEditConversationMutation();

  const { email: myEmail } = user;

  const {
    data: participent,
    isLoading,
    isError,
  } = useGetUserQuery(to, {
    skip: !userCheck,
  });

  console.log(participent);

  const hanldeDebounce = (fn, delay) => {
    let timeOut;
    return (...args) => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const debounceSearch = (value) => {
    if (ValidateEmail(value)) {
      setUserCheck(true);
      setTo(value);
    }
  };

  const handleEmailSearch = hanldeDebounce(debounceSearch, 2000);

  useEffect(() => {
    if (participent?.length > 0 && participent[0].email !== myEmail) {
      dispatch(conversationApi.endpoints.getConversation.initiate({ userEmail: myEmail, participentEmail: to }))
        .unwrap()
        .then((data) => setConversation(data))
        .catch((err) => setResponseError(""));
    }
  }, [participent, dispatch, myEmail, to]);

  console.log(conversation);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      console.log("iam here");
      editConversation({
        id: conversation[0].id,
        data: {
          participants: `${myEmail}-${participent[0].email}`,
          users: [user, participent[0]],
          message: message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      console.log("iam not here");
      addConversation({
        participants: `${myEmail}-${participent[0].email}`,
        users: [user, participent[0]],
        message: message,
        timestamp: new Date().getTime(),
      });
    }
  };

  return (
    open && (
      <>
        <div onClick={control} className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Send message</h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} method="POST">
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                  onChange={(e) => handleEmailSearch(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border
                 border-transparent text-sm font-medium rounded-md
                  text-white bg-violet-600 hover:bg-violet-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-violet-500"
                disabled={conversation === null || (participent?.length > 0 && participent[0].email === myEmail)}
              >
                Send Message
              </button>
            </div>

            {participent?.length === 0 && <Error message="This user does not exist!" />}
            {participent?.length > 0 && participent[0].email === myEmail && (
              <Error message="You can not send message yourself!" />
            )}
          </form>
        </div>
      </>
    )
  );
}
