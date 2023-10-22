import { Grid, Box, Typography } from "@mui/material"
import { GetCharacterQuery } from "../__generated__/graphql"
import { Circle } from "@mui/icons-material"

type SelectedCharacterProps = {
    selectedCharacter: NonNullable<GetCharacterQuery['character']>
}

const SelectedCharacter = ({ selectedCharacter }: SelectedCharacterProps) => {
    const statusColorMap = {
        'Dead': 'error',
        'Alive': 'success',
        'unknown': 'warning'
    } as const
    return <Grid item container spacing={2} xs={12}>
        <Grid item xs={4} display='flex' flexDirection={'column'} justifyContent={'center'}>
            <Box marginBottom={2} component='img' alt={`${selectedCharacter.name} image`} src={selectedCharacter.image ?? ''}></Box>
            <Typography variant='h4' textAlign={'center'}>{selectedCharacter.name}</Typography>
            <Typography>Gender: {selectedCharacter.gender}</Typography>
            <Typography display='flex' alignItems={'center'}>
                Status:
                <Circle
                    sx={{ fontSize: '12px', marginRight: '4px', marginLeft: '4px' }}
                    color={selectedCharacter.status ? statusColorMap[selectedCharacter.status as keyof typeof statusColorMap] : 'info'}
                />
                {selectedCharacter.status}
            </Typography>
        </Grid>
        <Grid item xs={8}>
            <Typography>Origin</Typography>
            <Typography variant='h3'>{selectedCharacter.origin?.name}</Typography>
            <Typography>Last known location</Typography>
            <Typography variant='h3'>{selectedCharacter.location?.name}</Typography>
            <Typography>Residents</Typography>
        </Grid>
    </Grid>
}

export { SelectedCharacter }