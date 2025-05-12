import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login/Login';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import { apiFetch } from '#utils/apiFetch';

vi.mock('#utils/apiFetch', () => {
    return {
        apiFetch: vi.fn(),
    };
});

const renderLogin = () => render(<Login />, { wrapper: BrowserRouter });

describe('Login view', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza campos y botón correctamente', () => {
        renderLogin();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña', { selector: 'input' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it('muestra error si la contraseña es demasiado corta', async () => {
        renderLogin();
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@email.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña', { selector: 'input' }), { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(await screen.findByText(/al menos 6 caracteres/i)).toBeInTheDocument();
    });

    it('muestra modal si usuario ya está conectado (403)', async () => {
        apiFetch.mockRejectedValueOnce({ status: 403 });
        renderLogin();
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@email.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña', { selector: 'input' }), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(await screen.findByText(/ya has iniciado sesión en otro dispositivo/i)).toBeInTheDocument();
    });

    it('muestra error si usuario no encontrado (404)', async () => {
        apiFetch.mockRejectedValueOnce({ status: 404 });
        renderLogin();
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'notfound@email.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña', { selector: 'input' }), { target: { value: '123456' } });
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(await screen.findByText(/usuario no encontrado/i)).toBeInTheDocument();
    });

    it('muestra error si contraseña incorrecta (401)', async () => {
        apiFetch.mockRejectedValueOnce({ status: 401 });
        renderLogin();
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'user@email.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña', { selector: 'input' }), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(await screen.findByText(/contraseña incorrecta/i)).toBeInTheDocument();
    });

    it('redirige al home tras login exitoso', async () => {
        apiFetch.mockResolvedValueOnce({
            token: 'mock-token',
            user: { id: 1, nickname: 'Test' }
        });
        renderLogin();
        fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'user@email.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña', { selector: 'input' }), { target: { value: 'correctpass' } });
        fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });
});
