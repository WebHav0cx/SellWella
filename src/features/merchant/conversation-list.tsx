import type { demoConversations } from "./conversation-data";
type Conversation = (typeof demoConversations)[number];
export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="conversation-list">
      {conversations.map((item) => (
        <button
          className={selectedId === item.id ? "active" : ""}
          onClick={() => {
            onSelect(item.id);
          }}
          key={item.id}
        >
          <i>{item.initials}</i>
          <span>
            <strong>
              {item.name}
              <small>{item.time}</small>
            </strong>
            <b>
              {item.channel} · {item.stage}
            </b>
            <p>{item.preview}</p>
          </span>
          {item.unread > 0 && <em>{item.unread}</em>}
        </button>
      ))}
    </div>
  );
}
