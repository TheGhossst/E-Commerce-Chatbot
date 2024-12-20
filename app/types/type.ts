export interface Message {
    text: string;
    isUser: boolean;
    timestamp: number;
}

export interface Chat {
    id: string;
    name: string;
    messages: Message[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
}