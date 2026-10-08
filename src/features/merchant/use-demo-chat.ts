"use client";

import { useEffect, useRef, useState } from "react";
import { demoConversations } from "./conversation-data";

export type ChatMessage = { from: string; text: string; sentAt?: string };

function message(from: string, text: string): ChatMessage {
  return {
    from,
    text,
    sentAt: new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Lagos",
    }).format(new Date()),
  };
}

export function useDemoChat() {
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [pending, setPending] = useState<Record<number, number>>({});
  const replyIndexes = useRef(new Map<number, number>());
  const queueEnds = useRef(new Map<number, number>());
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const timer of activeTimers) clearTimeout(timer);
      activeTimers.clear();
    };
  }, []);

  const append = (id: number, entry: ChatMessage) => {
    setMessages((current) => ({
      ...current,
      [id]: [...(current[id] ?? []), entry],
    }));
  };

  const sendMessage = (id: number, text: string) => {
    const trimmed = text.trim();
    const conversation = demoConversations.find((item) => item.id === id);
    if (!trimmed || !conversation) return;
    append(id, message("merchant", trimmed));

    const index = replyIndexes.current.get(id) ?? 0;
    const reply = conversation.demoReplies[index];
    if (!reply) return;
    replyIndexes.current.set(id, index + 1);
    setPending((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

    const now = Date.now();
    const due = Math.max(now, queueEnds.current.get(id) ?? now) + 1400;
    queueEnds.current.set(id, due);
    const timer = setTimeout(() => {
      append(id, message("customer", reply));
      setPending((current) => ({
        ...current,
        [id]: Math.max(0, (current[id] ?? 1) - 1),
      }));
      timers.current.delete(timer);
    }, due - now);
    timers.current.add(timer);
  };

  return { messages, pending, sendMessage };
}
