import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { Ref } from "react";

interface Props {
	reset: () => void;
}
const ResetButton = ({ reset }: Props) => {
	return (
		<Button className='text-lg p-6' onClick={reset}>
			<FontAwesomeIcon icon={faRedo} />
			New Test
		</Button>
	);
};

export default ResetButton;
