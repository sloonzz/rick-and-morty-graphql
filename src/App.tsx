import { useQuery } from '@apollo/client'
import { Box, Button, Card, CardActionArea, CardContent, CircularProgress, Grid, TextField, Typography, debounce } from '@mui/material'
import { gql } from './__generated__'
import { isDefined } from './utils/is-defined'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import React from 'react'
import { SelectedCharacter } from './components/SelectedCharacter'

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

const getCharacterQuery = gql(`
  query GetCharacter($id: ID!) {
    character(id: $id) {
        id
        name
        gender
        image
        origin {
          id
          name
          residents {
            id
            name
          }
          dimension
        }
        location {
          name
          dimension
          residents {
            id
            name
          }
        }
        status
        episode {
          episode
          name
        }
    }
  }
`)

const SEARCH_PARAM_KEYS = {
  PAGE: 'page',
  QUERY: 'query',
  SELECTED: 'selected',
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get(SEARCH_PARAM_KEYS.PAGE) ?? '1')
  const searchQuery = searchParams.get(SEARCH_PARAM_KEYS.QUERY)
  const selectedCharacterId = searchParams.get(SEARCH_PARAM_KEYS.SELECTED) ?? '1'
  const { data, loading } = useQuery(getCharactersQuery, { variables: { page: page, search: searchQuery } })
  const { data: selectedCharacterData, loading: isSelectedCharacterDataLoading } = useQuery(getCharacterQuery, { variables: { id: selectedCharacterId } })
  const selectedCharacter = selectedCharacterData?.character
  const characters = data && data.characters ? data.characters.results?.filter(isDefined) : undefined
  const totalPages = data?.characters?.info?.pages ?? 0
  const canGoNextPage = totalPages > page
  const canGoPrevPage = page !== 1

  const setSearchParamValue = (key: string, value: string) => {
    setSearchParams(searchParams => {
      searchParams.set(key, value)
      return searchParams
    })
  }

  const nextPage = () => {
    if (canGoNextPage) {
      setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, `${page + 1}`)
    }
  }

  const prevPage = () => {
    if (canGoPrevPage) {
      setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, `${page - 1}`)
    }
  }

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParamValue(SEARCH_PARAM_KEYS.QUERY, event.target.value)
    setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, '1')
  }

  const onSelectCharacter = (id?: string | null) => {
    if (id) {
      setSearchParamValue(SEARCH_PARAM_KEYS.SELECTED, id)
    }
  }

  const debouncedSetSearchQuery = debounce(onSearchInputChange, 500)

  return (
    <>
      <Grid width='100vw' paddingX={8} spacing={2} container>
        <Grid padding={2} item container direction={'column'} xs={9}>
          {selectedCharacter && <>
            <SelectedCharacter selectedCharacter={selectedCharacter}></SelectedCharacter>
          </>}
          {isSelectedCharacterDataLoading && <Grid item xs={12} display='flex' justifyContent={'center'} alignItems={'center'}><CircularProgress></CircularProgress></Grid>}
        </Grid>
        <Grid item xs={3} height={'90vh'} display='flex' flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'}>
          <TextField
            placeholder='Search character name'
            fullWidth sx={{ marginBottom: '24px' }}
            onChange={debouncedSetSearchQuery}
          ></TextField>
          {loading &&
            <Box height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <CircularProgress></CircularProgress>
            </Box>
          }
          {characters && characters.length > 0 && <Grid container spacing={2} overflow={'scroll'} sx={{ overflowX: 'hidden' }}>
            {characters.map(character =>
              <Grid item xs={12}>
                <Card>
                  <CardActionArea onClick={() => onSelectCharacter(character.id)}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box marginBottom={2} component='img' alt={`${character.name} image`} src={character.image ?? ''}></Box>
                      <Typography textAlign={'center'} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {character.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            )}
          </Grid>}
          {characters?.length === 0 && <Box>No characters available</Box>}

          <Box display='flex' justifyContent={'center'}>
            <Button disabled={!canGoPrevPage || loading} onClick={prevPage}><ChevronLeft></ChevronLeft></Button>
            <Button disabled={!canGoNextPage || loading} onClick={nextPage}><ChevronRight></ChevronRight></Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default App
