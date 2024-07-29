// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
    })
);

describe('Login Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        mockNavigate.mockClear();
    });

    test('renders the login form correctly', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        
        expect(screen.getByPlaceholderText('Email address*')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password*')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('handles input correctly', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email address*');
        const passwordInput = screen.getByPlaceholderText('Password*');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    test('submits the form successfully and navigates to /home', async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email address*');
        const passwordInput = screen.getByPlaceholderText('Password*');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    test('displays an error message for invalid credentials', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({ ok: false }));

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email address*');
        const passwordInput = screen.getByPlaceholderText('Password*');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/login', expect.any(Object));
        });

        expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    test('displays an error message when the fetch request fails', async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email address*');
        const passwordInput = screen.getByPlaceholderText('Password*');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
});
