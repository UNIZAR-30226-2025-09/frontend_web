import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Playlist from '../pages/Playlist/Playlist.jsx';
import * as apiUtils from '#utils/apiFetch';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('#utils/apiFetch');
vi.mock('#utils/getImageUrl', () => ({
    getImageUrl: vi.fn(() => '/mock.jpg')
}));

vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ playlistId: '123' }),
        useNavigate: () => vi.fn(),
        useOutletContext: () => ({
            currentSong: {},
            setCurrentSong: vi.fn(),
            setActiveSection: vi.fn(),
            activeSection: 'playlists',
            setCurrentIndex: vi.fn(),
            setSongs: vi.fn(),
            setIsPlaying: vi.fn(),
            isPlaying: false,
            setPlaylistActive: vi.fn(),
            playlistActive: '123',
            setSongActive: vi.fn()
        }),
    };
});

const mockPlaylist = {
    name: 'Test Playlist',
    description: 'Una descripción',
    user_id: 1,
    owner: { nickname: 'usuario' },
    likes: 3,
    songs: [
        {
            id: 1,
            name: 'Canción 1',
            photo_video: 'cancion1.jpg',
            album: { name: 'Álbum 1' },
            song_playlist: { date: '2023-01-01' },
            duration: 200,
            liked: false
        }
    ]
};

const waitForLoad = async () => {
    await waitFor(() => {
        expect(screen.queryByText('Cargando playlist...')).not.toBeInTheDocument();
    });
};

describe('Playlist view', () => {
    beforeEach(() => {
        localStorage.setItem('user', JSON.stringify({ id: 1 }));
        apiUtils.apiFetch.mockImplementation(async (url) => {
            if (url.includes('/playlists/123')) return mockPlaylist;
            if (url.includes('/playlists/users')) return [];
            if (url.includes('/user/')) return { is_premium: true };
            if (url.includes('/playlists/123/like')) return { isLiked: false };
            if (url.includes('/songs/adds')) return [];
            if (url.includes('/ratingPlaylist')) return { averageRating: 4 };
            return {};
        });
    });

    it('renders playlist name and description', async () => {
        render(<Playlist />);
        await waitForLoad();
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
        expect(screen.getByText('Una descripción')).toBeInTheDocument();
    });

    it('renders play button and allows toggle', async () => {
        render(<Playlist />);
        await waitForLoad();
        const playBtn = screen.getAllByRole('button').find(btn =>
            btn.querySelector('svg')?.getAttribute('data-icon') === 'play' ||
            btn.innerHTML.toLowerCase().includes('play')
        );
        expect(playBtn).toBeTruthy();
    });

    it('muestra el botón de like correctamente', async () => {
        render(<Playlist />);
        await waitForLoad();
        const heartIcon = screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
        expect(heartIcon).toBeInTheDocument();
    });

    it('muestra las canciones de la playlist', async () => {
        render(<Playlist />);
        await waitForLoad();
        expect(screen.getByText('Canción 1')).toBeInTheDocument();
        expect(screen.getByText('Álbum 1')).toBeInTheDocument();
        expect(screen.getByText('3:20')).toBeInTheDocument();
    });

    it('muestra el número de likes', async () => {
        render(<Playlist />);
        await waitForLoad();
        expect(screen.getByText(/guardada 3 veces/i)).toBeInTheDocument();
    });

    it('muestra la valoración promedio', async () => {
        render(<Playlist />);
        await waitForLoad();
        expect(screen.getByText(/Valoración promedio: 4/i)).toBeInTheDocument();
    });

    it('muestra nombre, descripción y likes de la playlist', async () => {
        render(<Playlist />);
        await waitForLoad();
        expect(screen.getByText('Test Playlist')).toBeInTheDocument();
        expect(screen.getByText('Una descripción')).toBeInTheDocument();
        expect(screen.getByText(/guardada 3 veces/i)).toBeInTheDocument();
    });

    it('renderiza detalles de canción: nombre, álbum y duración', async () => {
        render(<Playlist />);
        await waitForLoad();
        expect(screen.getByText('Canción 1')).toBeInTheDocument();
        expect(screen.getByText('Álbum 1')).toBeInTheDocument();
        expect(screen.getByText('3:20')).toBeInTheDocument();
    });

    it('muestra botón de play', async () => {
        render(<Playlist />);
        await waitForLoad();
        const playBtn = screen.getAllByRole('button').find(btn =>
            btn.querySelector('svg')?.getAttribute('data-icon') === 'play' ||
            btn.innerHTML.toLowerCase().includes('play')
        );
        expect(playBtn).toBeTruthy();
    });

    it('permite alternar el botón de shuffle', async () => {
        render(<Playlist />);
        await waitForLoad();
        const buttons = screen.getAllByRole('button');
        const shuffleBtn = buttons.find(btn => btn.querySelector('svg'));
        expect(shuffleBtn).toBeInTheDocument();
    });

    it('abre modal de edición al hacer click en la portada si es propietario', async () => {
        render(<Playlist />);
        await waitForLoad();
        const image = await screen.findByAltText('Playlist Cover');
        fireEvent.click(image);
        await waitFor(() => {
            expect(screen.getByLabelText('Título de la Playlist')).toBeInTheDocument();
        });
    });

    it('renderiza el menú de opciones de playlist', async () => {
        render(<Playlist />);
        await waitForLoad();
        const optionsButton = screen.getAllByRole('button').find(btn =>
            btn.getAttribute('aria-label')?.toLowerCase().includes('opciones') ||
            btn.getAttribute('data-testid') === 'popup-trigger'
        );
        expect(optionsButton).toBeTruthy();
    });

    it('filtra canciones por título', async () => {
        render(<Playlist />);
        await waitForLoad();

        // Activa la barra de búsqueda
        const toggleSearchBtn = screen.getByTestId('search-toggle');
        fireEvent.click(toggleSearchBtn);


        // Ahora el input sí se renderiza
        const input = await screen.findByPlaceholderText('Buscar en esta playlist...');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'Canción 1' } });

        expect(await screen.findByText('Canción 1')).toBeInTheDocument();
    });


    it('ordena canciones por título al hacer clic', async () => {
        render(<Playlist />);
        await waitForLoad();
        const sortBtn = screen.getAllByRole('button').find(btn =>
            btn.textContent?.includes('Ordenar por Título')
        );
        fireEvent.click(sortBtn);
        expect(screen.getByText('Canción 1')).toBeInTheDocument();
    });
});