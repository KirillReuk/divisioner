/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

afterEach(() => {
  cleanup();
});

describe('Modal', () => {
  it('renders dialog, title, and children when open', () => {
    render(
      <Modal onClose={() => {}} title="Hello">
        <p>Modal body</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const heading = screen.getByRole('heading', { level: 2, name: 'Hello' });
    expect(heading.textContent).toBe('Hello');
    expect(screen.getByText('Modal body').textContent).toBe('Modal body');
  });

  it('links description for a11y when description is provided', () => {
    render(
      <Modal onClose={() => {}} title="T" description="More info">
        x
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const describedBy = dialog.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const desc = document.getElementById(describedBy!);
    expect(desc).toBeDefined();
    expect(desc!.textContent).toBe('More info');
  });

  it('does not set aria-describedby when there is no description', () => {
    render(
      <Modal onClose={() => {}} title="T">
        x
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-describedby')).toBeNull();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} title="T">
        x
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} title="T">
        x
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the modal panel content is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} title="T">
        <button type="button">Inside</button>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Inside' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal onClose={onClose} title="T">
        x
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape', bubbles: true });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open and restores previous overflow on close', () => {
    document.body.style.overflow = 'scroll';
    const onClose = vi.fn();

    const { unmount } = render(
      <Modal onClose={onClose} title="T">
        x
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('scroll');
  });

  it('hides the close button when showCloseButton is false', () => {
    render(
      <Modal onClose={() => {}} title="T" showCloseButton={false}>
        x
      </Modal>
    );

    expect(screen.queryByRole('button', { name: /close modal/i })).toBeNull();
  });
});
