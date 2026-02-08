import { useState, useEffect, useRef } from 'react';
import { useGetChat, useSendMessage, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UserAvatar from '../components/UserAvatar';
import ChatMessageBubble from '../components/ChatMessageBubble';

interface ChatScreenProps {
  recipientId: Principal;
  onBack: () => void;
}

export default function ChatScreen({ recipientId, onBack }: ChatScreenProps) {
  const { identity } = useInternetIdentity();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    data: messages = [], 
    isLoading: messagesLoading, 
    error: messagesError 
  } = useGetChat(recipientId);
  
  const { 
    data: recipientProfile, 
    isLoading: profileLoading, 
    error: profileError 
  } = useGetUserProfile(recipientId);
  
  const sendMessage = useSendMessage();

  const myPrincipal = identity?.getPrincipal().toString();

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage.mutate(
      { recipientId, content: message },
      {
        onSuccess: () => setMessage(''),
      }
    );
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white dark:bg-gray-900 shadow-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {profileLoading ? (
          <>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </>
        ) : profileError ? (
          <div className="flex-1 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">Error al cargar perfil</span>
          </div>
        ) : recipientProfile ? (
          <>
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <UserAvatar photo={recipientProfile.photo} name={recipientProfile.name} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{recipientProfile.name}</h2>
              <p className="text-xs text-muted-foreground">{recipientProfile.zone}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 text-muted-foreground text-sm">
            Usuario no disponible
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-br from-emerald-50/30 to-blue-50/30 dark:from-emerald-950/30 dark:to-blue-950/30">
        {messagesLoading ? (
          <div className="text-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando mensajes...</p>
          </div>
        ) : messagesError ? (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar mensajes. Verifica que tengas un match con este usuario.
            </AlertDescription>
          </Alert>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay mensajes todavía</p>
            <p className="text-sm mt-2">¡Envía el primer mensaje!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessageBubble
              key={i}
              message={msg}
              isOwn={msg.sender.toString() === myPrincipal}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1"
            disabled={sendMessage.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessage.isPending}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
