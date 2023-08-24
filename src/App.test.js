import { act, render, screen, waitForElementToBeRemoved, configure, within, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import React from 'react';
import App from './App';

beforeEach(async () => {
    render(<App />);
    // Ensure that the grid data has loaded before running tests
    await waitForElementToBeRemoved(() => screen.getByText('Loading...'), { timeout: 5000 });
});

const getSelectedCount = async () => {
    // Wait for the selected count to be updated
    const selectedCount = await waitFor(async () => await screen.findByLabelText('Selected Rows:'));
    return selectedCount.textContent;
};

const getClickedCell = async () => {
    // Wait for the clicked cell to be updated
    const selectedCellContents = await waitFor(async () => await screen.findByLabelText('Selected Cell Value:'));
    return selectedCellContents.textContent;
};

it('all rows selected', async () => {
    // no rows are selected initially
    expect(await getSelectedCount()).toBe('0');
    
    act(() => screen.getByText('Select All Rows').click());
    expect(await getSelectedCount()).toBe('8618');
});

it('all rows deselected after selection', async () => {
    act(() => screen.getByText('Select All Rows').click());
    expect(await getSelectedCount()).toBe('8618');

    act(() => screen.getByText('Deselect All Rows').click());
    expect(await getSelectedCount()).toBe('0');
});

it('single cell Click', async () => {
    
    act(() => screen.getByText('Select All Rows').click());
    expect(await getSelectedCount()).toBe('8618');

    act(() => screen.getByText('Alicia Coutts').click());
    
    //expect(await getCellContents()).toBe('Alicia Coutts');    
    expect(await getSelectedCount()).toBe('1');
});


it('multiple rows selected via shift click', async () => {
    act(() => screen.getByText("Alicia Coutts").click());
    expect(await getSelectedCount()).toBe('1');
    
    const element = screen.getByText("Allison Schmitt");
    const user = userEvent.setup();
    await user.keyboard("[ShiftLeft>]"); // Press Shift (without releasing it)
    await user.click(element);
    
    expect(await getSelectedCount()).toBe('4');
    expect(await getClickedCell()).toBe('Allison Schmitt');    
});


it("multiple rows selected via ctrl click", async () => {
  configure({ testIdAttribute: "col-id" });

  // Get first 3 rows
  const rows = screen.getAllByRole("row").slice(0, 3);
  const expectedYears = ["2008", "2004", "2012"];
  rows.forEach(async (row, index) => {
    await within(row).getByTestId("year").click();
    expect(await getClickedCell()).toBe(expectedYears[index]);
  });

  expect(await getSelectedCount()).toBe('1');
});