import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function ChatLoading() {
	return (
		<Stack spacing={1}>
			<Skeleton variant="text"/>
			<Skeleton variant="circular" width={40} height={40}/>
			<Skeleton variant="text"/>
			<Skeleton variant="circular" width={40} height={40}/>
		</Stack>
	);
}