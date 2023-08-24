import { act, render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import React from 'react';
import App from './App';

beforeEach(async () => {
    render(<App />);
    // Ensure that the grid data has loaded before running tests
    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), { timeout: 5000 });
});

it('all rows selected', async () => {
    // no rows are selected initially
    await screen.findByText('Selected Rows: 0');

    // no actual event data is needed for this particular event/use case
    act(() => screen.getByText('Select All Rows').click());
    await screen.findByText('Selected Rows: 8618');
});

it('all rows deselected after selection', async () => {

    act(() => screen.getByText('Select All Rows').click());
    await screen.findByText('Selected Rows: 8618');

    act(() => screen.getByText('Deselect All Rows').click());
    await screen.findByText('Selected Rows: 0');

});

it('single row selected via onClick', async () => {

    act(() => screen.getByText('Alicia Coutts').click());
    await screen.findByText('Selected Rows: 1');

});


it('multiple rows selected via shift click', async () => {
  act(() => screen.getByText("Alicia Coutts").click());
  await screen.findByText("Selected Rows: 1");

  const element = screen.getByText("Allison Schmitt");
  const user = userEvent.setup();
  await user.keyboard("[ShiftLeft>]"); // Press Shift (without releasing it)
  await user.click(element);

  await screen.findByText("Selected Rows: 4");
});