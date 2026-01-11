import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Loading() {
	return (
		<div className='flex justify-center items-center h-screen'>
			{/* Example Lucide spinner icon */}
			<FontAwesomeIcon
				icon={faSpinner}
				className='animate-spin h-10 w-10 text-blue-500'
			/>
			<p className='ml-2'>Loading data...</p>
		</div>
	);
}
