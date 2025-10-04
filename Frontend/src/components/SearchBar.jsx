export default function SearchBar({ query, setQuery, genre, setGenre, sort, setSort }) {
  return (
    <div className="toolbar">
      <input
        placeholder="Search by title or author"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">All Genres</option>
        <option>Fiction</option>
        <option>Non-Fiction</option>
        <option>Fantasy</option>
        <option>Romance</option>
        <option>Thriller</option>
        <option>Biography</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="year-desc">Year: High to Low</option>
        <option value="year-asc">Year: Low to High</option>
        <option value="rating-desc">Rating: High to Low</option>
        <option value="rating-asc">Rating: Low to High</option>
      </select>
    </div>
  );
}
