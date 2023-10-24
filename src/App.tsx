import React from 'react';
import { useQuery } from '@apollo/client';
import { Card, CircularProgress, Grid } from '@mui/material';
import { SelectedCharacter } from './components/SelectedCharacter';
import { SEARCH_PARAM_KEYS, useSearchParamsWrapper } from './utils/search-params';
import { CharacterSelection } from './components/CharacterSelection';
import { getCharacterQuery } from './graphql/queries/get-character';
import { getCharactersQuery } from './graphql/queries/get-characters';

function App() {
  const { searchParams } = useSearchParamsWrapper();
  const page = parseInt(searchParams.get(SEARCH_PARAM_KEYS.PAGE) ?? '1');
  const searchQuery = searchParams.get(SEARCH_PARAM_KEYS.QUERY);
  const selectedCharacterId = searchParams.get(SEARCH_PARAM_KEYS.SELECTED) ?? '1';
  const { data: getCharactersData, loading: isGetCharactersDataLoading } = useQuery(getCharactersQuery, { variables: { page: page, search: searchQuery } });
  const { data: selectedCharacterData, loading: isSelectedCharacterDataLoading } = useQuery(getCharacterQuery, { variables: { id: selectedCharacterId } });
  const selectedCharacter = selectedCharacterData?.character;

  return (
    <>
      <Grid width='100vw' paddingX={8} spacing={2} container>
        <Grid padding={2} height='92vh' item container direction={'column'} xs={9}>
          <Card sx={{ height: '100%', padding: 4, overflow: 'auto' }}>
            {selectedCharacter && <>
              <SelectedCharacter selectedCharacter={selectedCharacter} />
            </>}
            {isSelectedCharacterDataLoading && <Grid item height={'100%'} xs={12} display='flex' justifyContent={'center'} alignItems={'center'}><CircularProgress /></Grid>}
          </Card>
        </Grid>
        <Grid item xs={3} height={'92vh'} display='flex' flexDirection={'column'} justifyContent={'space-between'} alignItems={'center'}>
          <CharacterSelection getCharactersData={getCharactersData} loading={isGetCharactersDataLoading} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
