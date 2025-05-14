import {render, screen, waitFor } from '@testing-library/react';
import Song from '../pages/Song/Song.jsx';
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
        useParams: () => ({ songId: '1' }),
        useNavigate: () => vi.fn(),
        useOutletContext: () => ({
            currentSong: {},
            setCurrentSong: vi.fn(),
            setActiveSection: vi.fn(),
            activeSection: 'songs',
            setCurrentIndex: vi.fn(),
            setSongs: vi.fn(),
            setIsPlaying: vi.fn(),
            isPlaying: false,
            setPlaylistActive: vi.fn(),
            songActive: 1,
            setSongActive: vi.fn(),
        }),
    };
});

const mockSong = {
    id: 1,
    name: 'Canción Test',
    duration: 210,
    photo_video: 'test.jpg',
    type: 'single',
    artist: { nickname: 'Artista Prueba' },
    album: { name: 'Álbum Prueba' },
    song_playlist: { date: '2023-01-01' },
};

const waitForSongLoad = async () => {
    await waitFor(() => {
        expect(screen.queryByText('Cargando canción...')).not.toBeInTheDocument();
    });
};

describe('Song view', () => {
    beforeEach(() => {
        localStorage.setItem('user', JSON.stringify({ id: 1 }));
        apiUtils.apiFetch.mockImplementation(async (url) => {
            if (url.includes('/songs/1')) return mockSong;
            if (url.includes('/song_like/1/like')) return { isLiked: true, liked: true };
            if (url.includes('/playlists/songliked')) return { playlist: { id: 10 } };
            if (url.includes('/playlists/users')) return [];
            return {};
        });
    });

    it('renderiza el nombre y artista de la canción', async () => {
        render(<Song />);
        await waitForSongLoad();
        const titles = await screen.findAllByText('Canción Test');
        expect(titles.length).toBeGreaterThan(0);
        expect(await screen.findByText('Artista Prueba')).toBeInTheDocument();
    });

    it('muestra la duración formateada correctamente', async () => {
        render(<Song />);
        await waitForSongLoad();
        const times = screen.getAllByText('3:30');
        expect(times.length).toBeGreaterThan(0);
    });

    it('muestra la imagen de portada de la canción', async () => {
        render(<Song />);
        await waitForSongLoad();
        const img = await screen.findByAltText('Song Cover');
        expect(img).toHaveAttribute('src', expect.stringContaining('/mock.jpg'));
    });

    it('muestra el botón de like activo', async () => {
        render(<Song />);
        await waitForSongLoad();
        const likeBtn = screen.getAllByRole('button').find(btn =>
            btn.querySelector('svg')?.classList.contains('heart-icon')
        );
        expect(likeBtn).toBeTruthy();
    });

    it('renderiza el menú de opciones con submenú', async () => {
        render(<Song />);
        await waitForSongLoad();
        const buttons = await screen.findAllByRole('button');
        const menuBtn = buttons.find(btn =>
            btn.getAttribute('aria-label')?.includes('Opciones de canción') ||
            btn.querySelector('svg')?.classList.contains('song-options-icon')
        );
        expect(menuBtn).toBeTruthy();
    });
});
