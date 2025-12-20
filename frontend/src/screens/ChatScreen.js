import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; 
import '../App.css'; 

function ChatScreen() {
    const [messages, setMessages] = useState([
        { text: "Hi there! I'm your PetCareSL Assistant 🤖. How can I help you and your furry friend today? 🐾", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.map(msg => ({
                role: msg.sender === 'user' ? 'human' : 'ai',
                content: msg.text
            }));

            const response = await axios.post('https://yemani-petcare-chatbot.hf.space/ask', { 
                message: input, 
                history: chatHistory 
            });

            const botMessage = { text: response.data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { text: "Oops! My connection is a bit fuzzy. Can you try again? 🐶", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-6 px-4 flex justify-center items-center">
            
            <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden h-[85vh] flex flex-col border border-gray-100 relative">
                
                {/* Header */}
                <div className="bg-[#A0522D] p-4 flex items-center gap-4 shadow-md z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl border-2 border-white/30">
                        🤖
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg">PetCareSL Assistant</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-white/80 text-xs font-medium">Online</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                        >
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0 border border-orange-200">
                                    🤖
                                </div>
                            )}

                            
                            <div 
                                className={`max-w-[80%] p-4 text-sm md:text-base shadow-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                    ? 'bg-[#A0522D] text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-2xl rounded-tl-none'
                                }`}
                            >
                                <ReactMarkdown 
                                    components={{
                                      
                                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mt-2 mb-2" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mt-2 mb-2" {...props} />,
                                        
                                        strong: ({node, ...props}) => <span className="font-bold text-[#A0522D]" {...props} />,
                                       
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start animate-pulse">
                             <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-2 mt-1 border border-orange-200">
                                🤖
                            </div>
                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="flex gap-2 items-center relative">
                        <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask about pet care..." 
                            className="w-full py-4 pl-6 pr-14 rounded-full bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/20 outline-none transition-all shadow-inner text-gray-700 placeholder-gray-400"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className={`absolute right-2 p-2.5 rounded-full transition-all duration-300 ${
                                !input.trim() 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-[#A0522D] text-white hover:bg-[#8B4513] hover:scale-110 shadow-md'
                            }`}
                        >
                            <svg className="w-6 h-6 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                            </svg>
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-gray-400 mt-2">
                        AI can make mistakes. Please consult a vet for medical emergencies. 🏥
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatScreen;