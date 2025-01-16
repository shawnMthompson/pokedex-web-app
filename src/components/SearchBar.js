/**
 * Notes:
 *
 * Entering a query into the search bar will return a dropdown list of pokemon name and id matches for the given input. If you enter "Char", you will get pokemon that contain the letters "Char" in order
 * If you enter "1", you will get pokemon with IDs that contain 1 (e.g. #1, #10, #31, so on and so forth)
 * searchQuery.js utility will handle this.
 *
 * Also, "v" in the button is a placeholder for what will be a caret icon. Clicking on this icon will show the dropdown menu regardless of input query and list 14 entries.
 * By default it would showcase pokemon #1->#10. I want to limit the amount of results to 10 regardless for performance-related reasons.
 */

export default function SearchBar() {
  return (
    <div className="flex flex-wrap justify-center">
      <div className="flex">
        <input
          type="text"
          className="form-input bg-white outline-none px-4 py-2 text-black rounded-l-md"
          placeholder="Search Pokemon..."
        />
        <button className="bg-white outline-none px-4 py-2 font-bold text-black rounded-r-md">
          v
        </button>
      </div>
    </div>
  );
}
