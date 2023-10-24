import { gql } from "../../__generated__";

const getCharacterQuery = gql(`
  query GetCharacter($id: ID!) {
    character(id: $id) {
        id
        name
        gender
        species
        image
        origin {
          id
          name
          residents {
            id
            name
          }
          dimension
          type
        }
        location {
          id
          name
          residents {
            id
            name
          }
          dimension
          type
        }
        status
        episode {
          episode
          name
          air_date
        }
    }
  }
`);

export { getCharacterQuery };