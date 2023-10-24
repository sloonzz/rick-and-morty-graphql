import { gql } from "../../__generated__";

const getCharactersQuery = gql(`
  query GetCharacters($page: Int!, $search: String) {
    characters(page: $page, filter: { name: $search }) {
      results {
        id
        name
        gender
        image
        origin {
          id
        }
        status
      }
      info {
        count
        pages
        next
        prev
      }
    }
  }
`);

export { getCharactersQuery };