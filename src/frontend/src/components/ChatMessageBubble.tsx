import { ChatMessage } from '../backend';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

export default function ChatMessageBubble({ message, isOwn }: ChatMessageBubbleProps) {
  const date = new Date(Number(message.timestamp) / 1000000);
  const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 border rounded-bl-sm'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-white/70' : 'text-muted-foreground'
          }`}
        >
          {timeStr}
        </p>
      </div>
    </div>
  );
}
