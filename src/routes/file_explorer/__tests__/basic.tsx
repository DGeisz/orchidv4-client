import React from "react";
import { render, screen } from "@testing-library/react";
import FileExplorer from "../file_explorer";

it("renders without crashing", () => {
    render(<FileExplorer />);
    const new_page = screen.getByText(/new page/i);

    expect(new_page).toBeInTheDocument();
});

it("matches snapshot", () => {
    const file_explorer = render(<FileExplorer />);

    expect(file_explorer).toMatchSnapshot();
});
