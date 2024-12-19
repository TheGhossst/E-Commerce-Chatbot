'use client';

import { useState } from 'react';
import { Bot, ChevronDown, Settings, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Chat } from '@/app/types/type';

interface ChatSidebarProps {
    chats: Chat[];
    activeChat: string;
    onSelectChat: (chatId: string) => void;
    onNewChat: () => void;
    onDeleteChat: (chatId: string) => void;
    onRenameChat: (chatId: string, newName: string) => void;
}

export function ChatSidebar({
    chats,
    activeChat,
    onSelectChat,
    onNewChat,
    onDeleteChat,
    onRenameChat,
}: ChatSidebarProps) {
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [newChatName, setNewChatName] = useState('');
    const [menuOpenChatId, setMenuOpenChatId] = useState<string | null>(null);

    // Group chats by date
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const groupedChats = chats.reduce((acc: Record<string, Chat[]>, chat) => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        const date = lastMessage
            ? new Date(lastMessage.timestamp).toDateString()
            : today;

        if (date === today) {
            acc.Today = acc.Today || [];
            acc.Today.push(chat);
        } else if (date === yesterday) {
            acc.Yesterday = acc.Yesterday || [];
            acc.Yesterday.push(chat);
        } else {
            acc['Previous 7 Days'] = acc['Previous 7 Days'] || [];
            acc['Previous 7 Days'].push(chat);
        }
        return acc;
    }, {});

    const handleRenameSubmit = (chatId: string) => {
        if (newChatName.trim()) {
            onRenameChat(chatId, newChatName.trim());
            setEditingChatId(null);
            setNewChatName('');
        }
    };

    return (
        <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
            <button
                onClick={onNewChat}
                className="flex items-center gap-2 m-3 p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <span className="truncate">New chat</span>
                <span className="flex-shrink-0 text-gray-500">
                    <ChevronDown className="h-4 w-4" />
                </span>
            </button>

            <div className="flex-1 overflow-auto">
                {Object.entries(groupedChats).map(([period, periodChats]) => (
                    <div key={period} className="mb-4">
                        <h3 className="px-3 mb-2 text-sm text-gray-500">{period}</h3>
                        {periodChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`group relative flex items-center gap-3 px-3 py-3 text-sm transition-colors ${chat.id === activeChat
                                    ? 'bg-gray-100 text-black'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {editingChatId === chat.id ? (
                                    <form
                                        className="flex-1 flex items-center gap-2"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleRenameSubmit(chat.id);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={newChatName}
                                            onChange={(e) => setNewChatName(e.target.value)}
                                            placeholder="Enter chat name"
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                            autoFocus
                                            onBlur={() => {
                                                setEditingChatId(null);
                                                setNewChatName('');
                                            }}
                                        />
                                    </form>
                                ) : (
                                    <>
                                        <button
                                            className="flex-1 flex items-center gap-3 text-left"
                                            onClick={() => onSelectChat(chat.id)}
                                        >
                                            <Bot className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{chat.name}</span>
                                        </button>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setMenuOpenChatId(chat.id === menuOpenChatId ? null : chat.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-500" />
                                            </button>
                                            {menuOpenChatId === chat.id && (
                                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    <button
                                                        onClick={() => {
                                                            setEditingChatId(chat.id);
                                                            setNewChatName(chat.name);
                                                            setMenuOpenChatId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            onDeleteChat(chat.id);
                                                            setMenuOpenChatId(null);
                                                        }}
                                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 p-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                </div>
            </div>
        </div>
    );
}