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