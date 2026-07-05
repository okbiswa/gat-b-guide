'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageCircle, X, Send, User, Bot, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function AdmissionAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    maxToolRoundtrips: 5,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.query) {
        // We use append to simulate user typing and sending
        append({
          role: 'user',
          content: e.detail.query,
        });
      }
    };
    
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, [append]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 z-50 bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle size={24} />
          <span className="hidden md:inline font-medium">Ask AI Admission Advisor</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[95vw] md:w-[400px] h-[80vh] max-h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-border flex flex-col z-50 overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <GraduationCap size={24} />
              <div>
                <h3 className="font-bold">GAT-B Advisor</h3>
                <p className="text-xs text-blue-100">Powered by Gemini AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6 space-y-4">
                <Bot size={48} className="text-blue-500 opacity-50" />
                <p>Hi! I'm your GAT-B Admission Advisor.</p>
                <p className="text-sm">Tell me your score and category, and I'll help you find the best colleges based on historical cutoffs.</p>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className="flex flex-col gap-1">
                {/* User or Assistant Message Content */}
                {(m.role === 'user' || m.role === 'assistant') && m.content && (
                  <div className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-300">
                        <Bot size={16} />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-bl-none prose prose-sm dark:prose-invert overflow-hidden'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {/* Tool Invocations */}
                {m.toolInvocations?.map((toolInvocation: any) => (
                  <div key={toolInvocation.toolCallId} className="flex gap-3 justify-start items-center ml-11 text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 py-1 px-3 rounded-full w-fit border border-zinc-200 dark:border-zinc-700">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>Using tool: <strong>{toolInvocation.toolName}</strong></span>
                    {toolInvocation.state === 'result' ? (
                      <span className="text-green-600 dark:text-green-400">✓ Done</span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400 animate-pulse">...</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                  <Bot size={16} />
                </div>
                <div className="bg-white border rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t bg-white dark:bg-zinc-900 flex gap-2 items-end">
            <textarea
              className="flex-1 max-h-32 min-h-[44px] bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
              placeholder="e.g. I scored 163 in UR. Suggest colleges."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  // Trigger form submit
                  const form = e.currentTarget.form;
                  if (form) form.requestSubmit();
                }
              }}
              rows={1}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="h-[44px] w-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
