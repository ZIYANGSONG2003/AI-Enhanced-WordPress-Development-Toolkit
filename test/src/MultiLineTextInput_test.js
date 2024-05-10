// MultiLineTextInput.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiLineTextInput from './MultiLineTextInput';

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ gpt_response: 'Server response' }),
    })
);

describe('MultiLineTextInput Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders the component correctly', () => {
        render(<MultiLineTextInput />);
        expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument();
        expect(screen.getByText('Go to WordPress')).toBeInTheDocument();
        expect(screen.getByAltText('Logo')).toBeInTheDocument();
        expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
    });

    test('allows the user to create a new chat', () => {
        render(<MultiLineTextInput />);
        fireEvent.click(screen.getByText('New Chat'));
        expect(screen.getByText('Chat 1')).toBeInTheDocument();
    });

    test('allows the user to input text and send a message', async () => {
        render(<MultiLineTextInput />);
        fireEvent.click(screen.getByText('New Chat'));
        fireEvent.click(screen.getByText('Chat 1'));

        const input = screen.getByPlaceholderText('Type your message here...');
        fireEvent.change(input, { target: { value: 'Hello, GPT!' } });
        expect(input).toHaveValue('Hello, GPT!');

        const submitBtn = screen.getByText('▶');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Hello, GPT!')).toBeInTheDocument();
        expect(screen.getByText('Server response')).toBeInTheDocument();
    });

    test('displays error message when fetch fails', async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

        render(<MultiLineTextInput />);
        fireEvent.click(screen.getByText('New Chat'));
        fireEvent.click(screen.getByText('Chat 1'));

        const input = screen.getByPlaceholderText('Type your message here...');
        fireEvent.change(input, { target: { value: 'Hello, GPT!' } });
        expect(input).toHaveValue('Hello, GPT!');

        const submitBtn = screen.getByText('▶');
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('Failed to send message. Please try again later.')).toBeInTheDocument();
    });

    test('allows the user to change avatar', () => {
        render(<MultiLineTextInput />);
        
        const avatarInput = screen.getByTestId('avatarInput');
        const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
        
        fireEvent.change(avatarInput, { target: { files: [file] } });
        const avatar = screen.getByAltText('User Avatar');
        
        waitFor(() => {
            expect(avatar.src).toContain('data:image/png;base64');
        });
    });
});
