import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
} from "./ui/dropdown-menu";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import { useState } from "react";
import ChangePassword from "./change-password";
import DeleteAccount from "./delete-account";

interface Props {
	name: string;
	email: string;
}

const AccountDropdown = ({ name, email }: Props) => {
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button aria-label='open account dropdown' className='mr-2'>
						<FontAwesomeIcon icon={faUser} className={`text-xl`} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-60' align='end'>
					<DropdownMenuLabel className='text-lg'>{name}</DropdownMenuLabel>
					<DropdownMenuLabel className='text-lg'>{email}</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem
							onSelect={() => setShowPasswordDialog(true)}
							className='py-3 text-lg border-t-2 rounded-none justify-center'
						>
							Change Password
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() => setShowDeleteDialog(true)}
							className='py-3 text-red-500 text-lg font-bold border-t-2 rounded-none justify-center'
						>
							Delete Account
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<ChangePassword
				open={showPasswordDialog}
				setOpen={setShowPasswordDialog}
			/>
			<DeleteAccount open={showDeleteDialog} setOpen={setShowDeleteDialog} />
		</>
	);
};

export default AccountDropdown;
