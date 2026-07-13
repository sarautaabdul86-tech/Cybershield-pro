import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/Alerts';
import { aiAPI } from '../services/api';

export const AIAssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setMessages([...messages, { role: 'user', content: input }]);
    setLoading(true);

    try {
      const response = await aiAPI.chat({ message: input, context: 'learning' });
      setMessages((prev) => [...prev, { role: 'assistant', content: response.data.data.response }]);
      setInput('');
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Security Assistant</h1>
        
        <Card className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Ask me anything about cybersecurity!</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="input flex-1"
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={loading}>
              Send
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};
