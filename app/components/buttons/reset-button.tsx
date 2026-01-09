import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { Ref } from "react";

interface Props {
	reset: () => void;
	buttonRef: Ref<HTMLButtonElement>;
}
const ResetButton = ({ reset, buttonRef }: Props) => {
	return (
		<Button className='text-lg p-6' onClick={reset} ref={buttonRef}>
			<FontAwesomeIcon icon={faRedo} />
			New Test
		</Button>
	);
};

export default ResetButton;
