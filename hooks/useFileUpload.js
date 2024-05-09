import { useCallback, useState } from 'react'

export function useFileUpload({ onStarting } = {}) {
	const [, setFileName] = useState(undefined)
	// const [args, setArgs] = useState(undefined)
	const uploadFile = useCallback((event, ...args) => {
		if (!event?.target?.files[0]) {
			return
		}
		setFileName(event?.target.name)
    // setArgs({...args})
		onStarting(event?.target?.files[0], args)
	}, [onStarting])

	return [uploadFile];
};

export function useMultipleFileUpload({ onStarting } = {}) {
	// const [, setFileName] = useState(undefined)
	// const [args, setArgs] = useState(undefined)
	const uploadFile = useCallback((event, ...args) => {

		if ((Object.keys(event?.target?.files)?.length || 0) === 0) {
			return
		}
		// setFileName(event?.target.name)
    // setArgs({...args})
		onStarting(event?.target?.files, args)
	}, [onStarting])

	return [uploadFile];
};
