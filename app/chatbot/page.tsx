'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import {
    doc,
    collection,
    getDocs,
    setDoc,
    updateDoc,
    writeBatch,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { ChatSidebar } from './components/Sidebar';
import { ChatHeader } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { Toast } from '../components/Toast';
import { Bot, User } from 'lucide-react';
import { Chat } from '../types/type';

interface Message {
    text: string;
    isUser: boolean;
    timestamp: number;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
}


export default function ChatbotPage() {
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showToast, setShowToast] = useState(false);
    const [showLogoutToast, setShowLogoutToast] = useState(false);

    const handleNewChat = useCallback(async () => {
        const newChat: Chat = {
            id: uuidv4(),
            name: 'New Chat',
            messages: [],
        };
        setChats((prev) => [...prev, newChat]);
        setActiveChat(newChat.id);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const chatRef = doc(db, `users/${currentUser.uid}/chats/${newChat.id}`);
            await setDoc(chatRef, { name: newChat.name });
        } catch (error) {
            console.error('Error creating new chat:', error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const chatsSnapshot = await getDocs(
                        collection(db, `users/${currentUser.uid}/chats`)
                    );
                    const fetchedChats: Chat[] = [];

                    for (const chatDoc of chatsSnapshot.docs) {
                        const chatData = chatDoc.data();
                        const messagesSnapshot = await getDocs(
                            query(
                                collection(db, `users/${currentUser.uid}/chats/${chatDoc.id}/messages`),
                                orderBy('timestamp', 'asc') // Ensure messages are sorted by timestamp
                            )
                        );
                        const messages = messagesSnapshot.docs.map((doc) => doc.data() as Message);

                        fetchedChats.push({
                            id: chatDoc.id,
                            name: chatData.name,
                            messages,
                        });
                    }

                    setUserName(currentUser.displayName || 'User');
                    setChats(fetchedChats);

                    if (fetchedChats.length > 0) {
                        setActiveChat(fetchedChats[0].id);
                    } else {
                        handleNewChat();
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setChats([]);
                }
            } else {
                setShowToast(true);
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }
        });

        return () => unsubscribe();
    }, [router, handleNewChat]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats, activeChat]);



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats, activeChat]);

    const searchProducts = useCallback(async (query: string): Promise<Product[]> => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }, []);

    const handleRenameChat = useCallback(
        async (chatId: string, newName: string) => {
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === chatId ? { ...chat, name: newName } : chat
                )
            );

            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const chatRef = doc(db, `users/${currentUser.uid}/chats/${chatId}`);
                await updateDoc(chatRef, { name: newName });
            } catch (error) {
                console.error('Error renaming chat:', error);
            }
        },
        []
    );

    const storeMessage = async (chatId: string, message: Message) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const messageRef = doc(db, `users/${currentUser.uid}/chats/${chatId}/messages`, uuidv4());
            await setDoc(messageRef, message);
        } catch (error) {
            console.error('Error storing message:', error);
        }
    };


    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (input.trim() && !isLoading && activeChat) {
                setIsLoading(true);
                const userMessage: Message = { text: input, isUser: true, timestamp: Date.now() };

                setChats((prev) =>
                    prev.map((chat) =>
                        chat.id === activeChat
                            ? { ...chat, messages: [...chat.messages, userMessage] }
                            : chat
                    )
                );
                await storeMessage(activeChat, userMessage);
                setInput('');

                try {
                    const searchResults = await searchProducts(input);

                    let botResponse = '';
                    if (searchResults.length > 0) {
                        botResponse = `I found ${searchResults.length} product${
                            searchResults.length > 1 ? 's' : ''
                        } matching your search. Here ${
                            searchResults.length > 1 ? 'are some options' : 'is an option'
                        }:\n\n` +
                            searchResults
                                .slice(0, 3)
                                .map(
                                    (product) =>
                                        `${product.name} - $${product.price.toFixed(2)}\n${product.description.slice(
                                            0,
                                            100
                                        )}...`
                                )
                                .join('\n\n');
                    } else {
                        botResponse =
                            "I couldn't find any products matching your search. Can you try different keywords?";
                    }

                    const botMessage: Message = {
                        text: botResponse,
                        isUser: false,
                        timestamp: Date.now(),
                    };
                    setChats((prev) =>
                        prev.map((chat) =>
                            chat.id === activeChat
                                ? { ...chat, messages: [...chat.messages, botMessage] }
                                : chat
                        )
                    );
                    await storeMessage(activeChat, botMessage);
                } catch (error) {
                    console.error('Error processing message:', error);
                    const errorMessage: Message = {
                        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
                        isUser: false,
                        timestamp: Date.now(),
                    };

                    setChats((prev) =>
                        prev.map((chat) =>
                            chat.id === activeChat
                                ? { ...chat, messages: [...chat.messages, errorMessage] }
                                : chat
                        )
                    );
                    await storeMessage(activeChat, errorMessage);
                } finally {
                    setIsLoading(false);
                }
            }
        },
        [input, isLoading, activeChat, searchProducts]
    );


    const handleDeleteChat = useCallback(async (chatId: string) => {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (chatId === activeChat) {
            setActiveChat(null);
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const chatRef = doc(db, `users/${currentUser.uid}/chats/${chatId}`);
            const messagesRef = collection(db, `users/${currentUser.uid}/chats/${chatId}/messages`);

            const messageDocs = await getDocs(messagesRef);
            const batch = writeBatch(db);
            messageDocs.forEach((doc) => batch.delete(doc.ref));
            batch.delete(chatRef);

            await batch.commit();
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    }, [activeChat]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowLogoutToast(true);
            setTimeout(() => {
                setShowLogoutToast(false);
                router.push('/');
            }, 2000);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <div className="flex h-screen bg-white text-gray-900">
            <ChatSidebar
                chats={chats}
                activeChat={activeChat || ''}
                onSelectChat={setActiveChat}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onRenameChat={handleRenameChat}
            />
            <div className="flex flex-col flex-grow">
                <ChatHeader userName={userName} onLogout={handleLogout} />
                {showToast && <Toast message="Sign in first" />}
                {showLogoutToast && <Toast message="Logged out successfully" />}
                <main className="flex-grow overflow-auto p-4">
                    <div className="mx-auto max-w-3xl space-y-4">
                        {activeChat &&
                            chats
                                .find((chat) => chat.id === activeChat)
                                ?.messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {!message.isUser && (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                                                <Bot className="h-5 w-5 text-green-500" />
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-lg px-4 py-2 max-w-[85%] ${message.isUser
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-800 text-white'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.text}</p>
                                            <p className="mt-1 text-xs opacity-50">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        {message.isUser && (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
                                                <User className="h-5 w-5 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                        <div ref={messagesEndRef} />
                    </div>
                </main>
                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
