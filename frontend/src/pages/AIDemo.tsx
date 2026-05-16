import { FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api, getErrorMessage } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import type { ApiResponse, ChatMessage, ChatResponse } from "@/types";

export function AIDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello, how can I help you today?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const apiMessages = [
      ...messages.filter((m) => m.role !== "assistant" || messages.length > 1),
      userMessage,
    ];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await api.post<ApiResponse<ChatResponse>>("/api/v1/ai/chat", {
        messages: apiMessages,
        stream: false,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: data.data.content }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI request failed",
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Demo</h1>
        <p className="text-muted-foreground">Chat with the backend AI layer (mock/openai/groq/anthropic).</p>
      </div>

      <Card className="flex min-h-[480px] flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>Messages are sent to POST /api/v1/ai/chat</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          <div className="flex-1 max-h-[360px] space-y-3 overflow-y-auto rounded-md border p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-8 bg-primary text-primary-foreground"
                    : "mr-8 bg-muted text-foreground"
                }`}
              >
                <span className="mb-1 block text-xs font-semibold uppercase opacity-70">
                  {message.role}
                </span>
                {message.content}
              </div>
            ))}
            {isLoading && <p className="text-sm text-muted-foreground">Thinking...</p>}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
