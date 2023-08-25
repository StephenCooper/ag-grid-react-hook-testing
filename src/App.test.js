import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
  configure,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "./App";

beforeEach(async () => {
  render(<App />);
  // Ensure that the grid data has loaded before running tests
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."), {
    timeout: 5000,
  });
});


it("all rows selected via button", async () => {
  // no rows are selected initially
  expect(await getSelectedCount()).toBe("0");
  act(() => screen.getByText("Select All Rows").click());
  expect(await getSelectedCount()).toBe("8618");
});

it("all rows deselected after selection via button", async () => {
  act(() => screen.getByText("Select All Rows").click());
  expect(await getSelectedCount()).toBe("8618");

  act(() => screen.getByText("Deselect All Rows").click());
  expect(await getSelectedCount()).toBe("0");
});

it("single cell Click clears original selction", async () => {
  act(() => screen.getByText("Select All Rows").click());
  expect(await getSelectedCount()).toBe("8618");

  act(() => screen.getByText("Alicia Coutts").click());
  expect(await getSelectedCount()).toBe("1");
});

it("multiple rows selected via shift click", async () => {
  act(() => screen.getByText("Alicia Coutts").click());
  expect(await getSelectedCount()).toBe("1");

  const element = screen.getByText("Allison Schmitt");
  // Mimic a shift click to select a range of rows
  const user = userEvent.setup();
  await user.keyboard("[ShiftLeft>]"); // Press Shift (without releasing it)
  await user.click(element);

  expect(await getSelectedCount()).toBe("4");
  expect(await getClickedCell()).toBe("Allison Schmitt");
});

// Test helper to access AG Grid table rows by index
// Warning: rows can be displayed in different order to the DOM order see https://www.ag-grid.com/javascript-data-grid/accessibility/#ensure-dom-element-order
// Would not recommend setting ensureDomOrder=true as this will impact performance unless it is required for accessibility
const getRowByIndex = (index) => {
  const rows = screen
    .getAllByRole("row")
    // role row is also used for the header row so we need to filter those out
    .filter((row) => row.getAttribute("row-index") !== null);
  return rows[index];
};

it("multiple rows selected via clicking year cell", async () => {
  // for this test we need to use the column id as the test id attribute
  configure({ testIdAttribute: "col-id" });

  // Get first 3 rows
  const expectedYears = ["2008", "20054", "2012"];

  const validateRow = async (index) => {
    const row = getRowByIndex(index);
    within(row).getByTestId("year").click();
    const clickedCell = await getClickedCell();
    expect(clickedCell).toBe(expectedYears[index]);
    expect(await getSelectedCount()).toBe("1");
  };

  validateRow(0);
  validateRow(1);
  validateRow(2);
});


// Test helper for the demo app selection count property
const getSelectedCount = async () => {
    // Wait for the selected count to be updated
    const selectedCount = await waitFor(
      async () => await screen.findByLabelText("Selected Rows:")
    );
    return selectedCount.textContent;
  };
  
  // Test helper for the demo app selected cell property
  const getClickedCell = async () => {
    // Wait for the clicked cell to be updated
    const selectedCellContents = await waitFor(
      async () => await screen.findByLabelText("Selected Cell Value:")
    );
    return selectedCellContents.textContent;
  };