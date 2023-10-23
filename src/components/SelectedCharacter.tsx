import { Grid, Box, Typography, Tooltip, Divider } from "@mui/material"
import { GetCharacterQuery } from "../__generated__/graphql"
import { Circle } from "@mui/icons-material"
import { isDefined } from "../utils/is-defined"
import { SEARCH_PARAM_KEYS, useSearchParamsWrapper } from "../utils/search-params"

type Character = NonNullable<GetCharacterQuery['character']>

type Episode = NonNullable<Character['episode'][number]>

type Location = NonNullable<Character['location']>

type Resident = NonNullable<Location['residents'][number]>

type SelectedCharacterProps = {
    selectedCharacter: Character
}

const EpisodeTooltip = ({ episode, index, length }: { episode: Episode; index: number; length: number; }) => {
    const isLastItem = index === length - 1
    return (
        <>
            <Tooltip title={
                <>
                    <Typography>
                        {episode.episode}
                    </Typography>
                    <Typography>
                        {`Premiere Date: ${episode.air_date}`}
                    </Typography>
                </>
            }>
                <Typography sx={{ ':hover': { color: 'grey.500', cursor: 'pointer' } }} variant='h5' display='inline'>
                    {`${episode.name}${isLastItem ? '' : ', '}`}
                </Typography>
            </Tooltip>
        </>
    )
}

const ResidentItem = ({ resident, index, length }: { resident: Resident; index: number; length: number; }) => {
    const { setSearchParamValue } = useSearchParamsWrapper()
    const isLastItem = index === length - 1
    return (
        <Typography sx={{ ':hover': { color: 'grey.500', cursor: 'pointer' } }} display='inline' onClick={() => setSearchParamValue(SEARCH_PARAM_KEYS.SELECTED, resident.id ?? '')} variant='h5'>
            {`${resident.name}${isLastItem ? '' : ', '}`}
        </Typography>
    )
}

const SelectedCharacter = ({ selectedCharacter }: SelectedCharacterProps) => {
    const statusColorMap = {
        'Dead': 'error',
        'Alive': 'success',
        'unknown': 'warning'
    } as const
    const originResidentsDisplay = selectedCharacter.origin?.residents && selectedCharacter.origin.residents.length > 0 ?
        selectedCharacter.origin?.residents
            .filter(isDefined)
            .map((resident, index) =>
                <ResidentItem
                    key={resident.id}
                    resident={resident}
                    index={index}
                    length={selectedCharacter.origin?.residents.length ?? 0}
                />
            ) : 'unknown'
    const locationResidentsDisplay = selectedCharacter.location?.residents && selectedCharacter.location.residents.length > 0 ?
        selectedCharacter.location?.residents
            .filter(isDefined)
            .map((resident, index) =>
                <ResidentItem
                    key={resident.id}
                    resident={resident}
                    index={index}
                    length={selectedCharacter.location?.residents.length ?? 0}
                />
            ) : 'unknown'
    return (
        <Grid item container spacing={4} xs={12}>
            <Grid item xs={4} display='flex' flexDirection={'column'}>
                <Box maxHeight='300px' marginBottom={2} display='flex' justifyContent={'center'}>
                    <Box width='100%' height='100%' maxWidth='300px' maxHeight='300px' component='img' alt={`${selectedCharacter.name} image`} src={selectedCharacter.image ?? ''}></Box>
                </Box>
                <Typography marginBottom={3} variant='h4' textAlign={'center'}>{selectedCharacter.name}</Typography>
                <Typography marginBottom={1} variant='h5'>{selectedCharacter.gender} - {selectedCharacter.species}</Typography>
                <Typography marginBottom={1} variant='h5' display='flex' alignItems={'center'}>
                    <Circle
                        sx={{ fontSize: '12px', marginRight: '4px', marginLeft: '4px' }}
                        color={selectedCharacter.status ? statusColorMap[selectedCharacter.status as keyof typeof statusColorMap] : 'info'}
                    />
                    {selectedCharacter.status}
                </Typography>
            </Grid>
            <Grid item container xs={8} spacing={4}>
                <Grid item xs={12}>
                    <Typography color="grey.500">Origin:</Typography>
                    <Typography variant='h4'>{selectedCharacter.origin?.name}</Typography>
                    <Typography color="grey.500">Type:</Typography>
                    <Typography variant='h4'>{selectedCharacter.origin?.type ?? 'unknown'}</Typography>
                    <Typography color="grey.500">Residents:</Typography>
                    <Box paddingX={1} sx={{ overflowX: 'hidden', backgroundColor: 'grey.800', fontSize: '24px' }} height='100px'>
                        {originResidentsDisplay}
                    </Box>
                </Grid>
                <Divider></Divider>
                <Grid item xs={12}>
                    <Typography color="grey.500">Last known location:</Typography>
                    <Typography variant='h4'>{selectedCharacter.location?.name}</Typography>
                    <Typography color="grey.500">Type:</Typography>
                    <Typography variant='h4'>{selectedCharacter.location?.type ?? 'unknown'}</Typography>
                    <Typography color="grey.500">Residents:</Typography>
                    <Box paddingX={1} sx={{ overflowX: 'hidden', backgroundColor: 'grey.800', fontSize: '24px' }} height='100px'>
                        {locationResidentsDisplay}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography color="grey.500">Appeared In:</Typography>
                    <Box paddingX={1} sx={{ overflowX: 'hidden', backgroundColor: 'grey.800', fontSize: '24px' }} height='100px'>
                        {selectedCharacter.episode?.filter(isDefined)
                            .map((ep, index) =>
                                <EpisodeTooltip key={ep.episode} episode={ep} index={index} length={selectedCharacter.episode.length} />
                            )
                        }
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}

export { SelectedCharacter }