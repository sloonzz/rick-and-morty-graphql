import { ChevronLeft, ChevronRight, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from "@mui/icons-material";
import { TextField, Box, CircularProgress, Grid, Card, CardActionArea, CardContent, Typography, Button, debounce } from "@mui/material";
import React from "react";
import { GetCharactersQuery } from "../__generated__/graphql";
import { SEARCH_PARAM_KEYS, useSearchParamsWrapper } from "../utils/search-params";
import { isDefined } from "../utils/is-defined";

type CharacterSelectionProps = {
  loading: boolean
  getCharactersData: GetCharactersQuery | undefined
};

const CharacterSelection = ({ loading, getCharactersData }: CharacterSelectionProps) => {
  const { searchParams, setSearchParamValue } = useSearchParamsWrapper();
  const page = parseInt(searchParams.get(SEARCH_PARAM_KEYS.PAGE) ?? '1');
  const characters = getCharactersData && getCharactersData.characters ? getCharactersData.characters.results?.filter(isDefined) : undefined;
  const totalPages = getCharactersData?.characters?.info?.pages ?? 0;
  const canGoNextPage = totalPages > page;
  const canGoPrevPage = page !== 1;

  const firstPage = () => {
    if (canGoPrevPage) {
      setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, `${1}`);
    }
  };

  const nextPage = () => {
    if (canGoNextPage) {
      setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, `${page + 1}`);
    }
  };

  const prevPage = () => {
    if (canGoPrevPage) {
      setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, `${page - 1}`);
    }
  };

  const lastPage = () => {
    if (canGoNextPage) {
      setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, `${totalPages}`);
    }
  };

  const onSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParamValue(SEARCH_PARAM_KEYS.QUERY, event.target.value);
    setSearchParamValue(SEARCH_PARAM_KEYS.PAGE, '1');
  };

  const onSelectCharacter = (id?: string | null) => {
    if (id) {
      setSearchParamValue(SEARCH_PARAM_KEYS.SELECTED, id);
    }
  };

  const debouncedSetSearchQuery = debounce(onSearchInputChange, 500);

  return (
    <>
      <TextField
        data-test-id={'search-character-name-input'}
        placeholder='Search character name'
        fullWidth sx={{ marginBottom: '24px' }}
        onChange={debouncedSetSearchQuery}
      />
      {
        loading &&
        <Box height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress />
        </Box>
      }
      {
        characters && characters.length > 0 && <Grid container spacing={2} overflow={'scroll'} sx={{ overflowX: 'hidden' }}>
          {characters.map(character =>
            <Grid data-test-id={`character-select-${character.id}`} key={character.id} item xs={12}>
              <Card>
                <CardActionArea onClick={() => onSelectCharacter(character.id)}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box marginBottom={2} component='img' alt={`${character.name} image`} src={character.image ?? ''} />
                    <Typography textAlign={'center'} sx={{ fontSize: 14 }} gutterBottom>
                      {character.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )}
        </Grid>
      }
      {characters?.length === 0 && <Box>No characters available</Box>}
      <Box display='flex' justifyContent={'center'} alignItems={'center'}>
        <Button data-test-id={'first-page-button'} disabled={!canGoPrevPage || loading} onClick={firstPage}><KeyboardDoubleArrowLeft /></Button>
        <Button data-test-id={'previous-page-button'} disabled={!canGoPrevPage || loading} onClick={prevPage}><ChevronLeft /></Button>
        <Typography width='20px' textAlign={'center'}>{page}</Typography>
        <Button data-test-id={'next-page-button'} disabled={!canGoNextPage || loading} onClick={nextPage}><ChevronRight /></Button>
        <Button data-test-id={'last-page-button'} disabled={!canGoNextPage || loading} onClick={lastPage}><KeyboardDoubleArrowRight /></Button>
      </Box>
    </>
  );

};

export { CharacterSelection };