import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Friends from '../pages/Friends/Friends';
import { vi } from 'vitest';

// Mocks globales
vi.mock('@/utils/helpers', () => ({
    getInitialsAvatar: (nickname) => ({ initial: nickname[0], bgColor: '#123456' }),
    getImageUrl: (url) => url,
    formatRelativeTime: () => 'hace 1 hora',
    formatDateSeparator: () => 'Hoy',
    formatMessageTime: () => '12:00',
    linkify: (text) => text,
}));

vi.mock('@/hooks/useUser', () => ({
    useUserId: () => 1,
}));

const mockUseFriendsData = {
    friends: [{ friendId: 2, nickname: 'Lucas', user_picture: null }],
    conversations: [{
        friend: { id: 2, nickname: 'Lucas', user_picture: null },
        lastMessage: {
            user1_id: 1,
            txt_message: 'Hola test',
            sent_at: new Date().toISOString()
        },
        unreadCount: 1,
    }],
    receivedRequests: [],
    sentRequests: [],
    isLoading: false,
    error: null,
    setError: vi.fn(),
    searchResults: [],
    searchTerm: '',
    setSearchTerm: vi.fn(),
    handleSearch: vi.fn(),
    clearSearch: vi.fn(),
    showAllConversationsModal: false,
    setShowAllConversationsModal: vi.fn(),
    showAllFriendsModal: false,
    setShowAllFriendsModal: vi.fn(),
    showAllRequestsModal: false,
    setShowAllRequestsModal: vi.fn(),
    showAllReceivedRequestsModal: false,
    setShowAllReceivedRequestsModal: vi.fn(),
};

vi.mock('@/hooks/useFriends', () => ({
    useFriendsData: () => mockUseFriendsData,
}));

vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'token') return 'mock-token';
    if (key === 'userId') return '1';
    return null;
});

describe('Friends view', () => {
    it('renderiza pestañas principales', () => {
        render(<Friends />);
        expect(screen.getByText('Social')).toBeInTheDocument();
        expect(screen.getByText('Chats')).toBeInTheDocument();
        expect(screen.getByText('Solicitudes')).toBeInTheDocument();
        expect(screen.getByText('Buscar Amigos')).toBeInTheDocument();
    });
});
